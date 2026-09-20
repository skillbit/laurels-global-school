"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    department: String(formData.get("department") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    posted_date: String(formData.get("posted_date") || "") || undefined,
    is_active: formData.get("is_active") === "on",
  };
}

function validate(fields: ReturnType<typeof readFields>) {
  if (!fields.title) return "Job title is required.";
  if (fields.title.length > 150) return "Job title must be under 150 characters.";
  if ((fields.department?.length ?? 0) > 80) return "Department must be under 80 characters.";
  if ((fields.description?.length ?? 0) > 4000) return "Description must be under 4000 characters.";
  return null;
}

function refresh() {
  revalidatePath("/admin/careers");
  revalidatePath("/admin");
  revalidatePath("/careers");
}

export async function createJobPosting(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  const problem = validate(fields);
  if (problem) redirect(`/admin/careers/new?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { error } = await supabase.from("job_postings").insert(fields);
  if (error) redirect(`/admin/careers/new?error=${encodeURIComponent(error.message)}`);

  refresh();
  redirect("/admin/careers?success=created");
}

export async function updateJobPosting(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  const problem = validate(fields);
  if (problem) redirect(`/admin/careers/${id}?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { error } = await supabase
    .from("job_postings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) redirect(`/admin/careers/${id}?error=${encodeURIComponent(error.message)}`);

  refresh();
  redirect("/admin/careers?success=updated");
}

export async function deleteJobPosting(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  await supabase.from("job_postings").delete().eq("id", id);

  refresh();
  redirect("/admin/careers?success=deleted");
}

export async function toggleJobPostingActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("job_postings").update({ is_active: next }).eq("id", id);

  refresh();
}
