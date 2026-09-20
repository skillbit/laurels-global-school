"use server";

import { createClient } from "@/lib/supabase/server";
import { alertNewEnquiry } from "@/lib/notify";

export type EnquiryState = {
  status: "idle" | "ok" | "err";
  message?: string;
  values?: Record<string, string>;
};

const FIELDS = ["parentName", "phone", "childAge", "grade", "message"] as const;

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot — real users never see or fill this field.
  if (String(formData.get("website") || "").trim()) {
    return { status: "ok" };
  }

  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) || "").trim()])
  ) as Record<(typeof FIELDS)[number], string>;

  if (!values.parentName || !values.phone || !values.childAge || !values.grade) {
    return { status: "err", message: "Please fill in all required fields.", values };
  }
  if (values.phone.replace(/\D/g, "").length < 10) {
    return { status: "err", message: "Please enter a valid phone number (at least 10 digits).", values };
  }
  if (
    values.parentName.length > 100 ||
    values.phone.length > 20 ||
    values.childAge.length > 30 ||
    values.grade.length > 30 ||
    values.message.length > 2000
  ) {
    return { status: "err", message: "One of the fields is too long.", values };
  }

  const supabase = await createClient();
  // No .select() — the public role can insert into `enquiries` but not read it back.
  const { error } = await supabase.from("enquiries").insert({
    parent_name: values.parentName,
    phone: values.phone,
    child_age: values.childAge,
    grade_applying: values.grade,
    message: values.message || null,
  });

  if (error) {
    return {
      status: "err",
      message: "Something went wrong sending your enquiry. Please call the office directly.",
      values,
    };
  }

  // WhatsApp alert to the office (sent after the response; never blocks or fails the form).
  alertNewEnquiry({
    parentName: values.parentName,
    phone: values.phone,
    grade: values.grade,
    childAge: values.childAge,
    message: values.message,
  });

  return { status: "ok" };
}
