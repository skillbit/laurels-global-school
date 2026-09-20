"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { alertNewApplication } from "@/lib/notify";

export type ApplicationState = {
  status: "idle" | "ok" | "err";
  message?: string;
  values?: Record<string, string>;
};

const FIELDS = ["applicantName", "phone", "email", "job", "message"] as const;
const MAX_RESUME_BYTES = 3 * 1024 * 1024;
const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function submitApplication(_prev: ApplicationState, formData: FormData): Promise<ApplicationState> {
  // Honeypot — real users never see or fill this field.
  if (String(formData.get("website") || "").trim()) return { status: "ok" };

  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) || "").trim()])
  ) as Record<(typeof FIELDS)[number], string>;
  const fail = (message: string): ApplicationState => ({ status: "err", message, values });

  if (!values.applicantName || !values.phone) return fail("Please fill in your name and phone number.");
  if (values.phone.replace(/\D/g, "").length < 10) return fail("Please enter a valid phone number (at least 10 digits).");
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) return fail("Please enter a valid email address.");
  if (values.applicantName.length > 100 || values.phone.length > 20 || values.email.length > 120 || values.message.length > 2000) {
    return fail("One of the fields is too long.");
  }

  const resume = formData.get("resume");
  const hasResume = resume instanceof File && resume.size > 0;
  let ext = "";
  if (hasResume) {
    ext = resume.name.split(".").pop()?.toLowerCase() ?? "";
    if (!RESUME_TYPES[ext]) return fail("The resume must be a PDF or Word document (.pdf, .doc, .docx).");
    if (resume.size > MAX_RESUME_BYTES) return fail("The resume must be smaller than 3 MB.");
  }

  const supabase = await createClient();

  // Only accept applications for positions that are currently open.
  let jobId: string | null = null;
  let jobTitle: string | null = null;
  if (values.job) {
    const { data: job } = await supabase
      .from("job_postings")
      .select("id, title")
      .eq("id", values.job)
      .eq("is_active", true)
      .maybeSingle();
    if (!job) return fail("That position is no longer open. Please pick another or choose a general application.");
    jobId = job.id;
    jobTitle = job.title;
  }

  // Resumes go to the private bucket; anonymous visitors can't write there, so upload with the service role.
  let resumePath: string | null = null;
  const storage = createAdminClient().storage.from("private");
  if (hasResume) {
    resumePath = `resumes/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await storage.upload(resumePath, resume, { contentType: RESUME_TYPES[ext] });
    if (uploadError) return fail("We couldn't upload your resume. Please try again, or apply without it and call the office.");
  }

  // No .select() — the public role can insert applications but not read them back.
  const { error } = await supabase.from("career_applications").insert({
    job_posting_id: jobId,
    applicant_name: values.applicantName,
    phone: values.phone,
    email: values.email || null,
    resume_path: resumePath,
    message: values.message || null,
  });

  if (error) {
    if (resumePath) await storage.remove([resumePath]);
    return fail("Something went wrong sending your application. Please call the office directly.");
  }

  // WhatsApp alert to the office (sent after the response; never blocks or fails the form).
  alertNewApplication({
    name: values.applicantName,
    phone: values.phone,
    position: jobTitle ?? "a general application",
    hasResume: Boolean(resumePath),
  });

  return { status: "ok" };
}
