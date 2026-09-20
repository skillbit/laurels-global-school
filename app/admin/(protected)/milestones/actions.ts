"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function readFields(formData: FormData) {
  return {
    year: Number(formData.get("year")),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    is_published: formData.get("is_published") === "on",
  };
}

function validate(fields: ReturnType<typeof readFields>) {
  const maxYear = new Date().getFullYear() + 1;
  if (!Number.isInteger(fields.year) || fields.year < 1900 || fields.year > maxYear) {
    return `Enter a year between 1900 and ${maxYear}.`;
  }
  if (!fields.title) return "A title is required.";
  if (fields.title.length > 120) return "Title must be under 120 characters.";
  if ((fields.description?.length ?? 0) > 600) return "Description must be under 600 characters.";
  return null;
}

function refresh() {
  revalidatePath("/admin/milestones");
  revalidatePath("/admin");
  revalidatePath("/about");
}

export async function createMilestone(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  const problem = validate(fields);
  if (problem) redirect(`/admin/milestones/new?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { error } = await supabase.from("milestones").insert(fields);
  if (error) redirect(`/admin/milestones/new?error=${encodeURIComponent(error.message)}`);

  refresh();
  redirect("/admin/milestones?success=created");
}

export async function updateMilestone(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  const problem = validate(fields);
  if (problem) redirect(`/admin/milestones/${id}?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { error } = await supabase
    .from("milestones")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) redirect(`/admin/milestones/${id}?error=${encodeURIComponent(error.message)}`);

  refresh();
  redirect("/admin/milestones?success=updated");
}

export async function deleteMilestone(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  await supabase.from("milestones").delete().eq("id", id);

  refresh();
  redirect("/admin/milestones?success=deleted");
}

export async function toggleMilestonePublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("milestones").update({ is_published: next }).eq("id", id);

  refresh();
}
