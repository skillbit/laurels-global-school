"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function readEventFields(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    event_date: String(formData.get("event_date") || ""),
    end_date: String(formData.get("end_date") || "") || null,
    category: String(formData.get("category") || "").trim() || null,
    is_published: formData.get("is_published") === "on",
  };
}

function validate(fields: ReturnType<typeof readEventFields>) {
  if (!fields.title || !fields.event_date) return "Title and start date are required.";
  if (fields.title.length > 150) return "Title must be under 150 characters.";
  if ((fields.description?.length ?? 0) > 2000) return "Description must be under 2000 characters.";
  if ((fields.category?.length ?? 0) > 40) return "Category must be under 40 characters.";
  if (fields.end_date && fields.end_date < fields.event_date) return "The end date can't be before the start date.";
  return null;
}

function refresh() {
  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/events");
  revalidatePath("/");
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const fields = readEventFields(formData);

  const problem = validate(fields);
  if (problem) redirect(`/admin/events/new?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert(fields);
  if (error) redirect(`/admin/events/new?error=${encodeURIComponent(error.message)}`);

  refresh();
  redirect("/admin/events?success=created");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readEventFields(formData);

  const problem = validate(fields);
  if (problem) redirect(`/admin/events/${id}?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) redirect(`/admin/events/${id}?error=${encodeURIComponent(error.message)}`);

  refresh();
  redirect("/admin/events?success=updated");
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);

  refresh();
  redirect("/admin/events?success=deleted");
}

export async function toggleEventPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("events").update({ is_published: next }).eq("id", id);

  refresh();
}
