"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { noticeFilePath } from "@/lib/documents";

function readNoticeFields(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    body: String(formData.get("body") || "").trim(),
    notice_date: String(formData.get("notice_date") || "") || undefined,
    attachment_url: String(formData.get("attachment_url") || "").trim() || null,
    is_published: formData.get("is_published") === "on",
  };
}

// Returns an error message, or null when the fields are fine.
function invalid(fields: ReturnType<typeof readNoticeFields>) {
  if (!fields.title || !fields.body) return "Title and body are required.";
  if (fields.title.length > 200) return "Title must be under 200 characters.";
  if (fields.attachment_url && !/^https?:\/\/\S+$/.test(fields.attachment_url)) {
    return "The attachment link must start with https://";
  }
  return null;
}

function refresh() {
  revalidatePath("/admin/notices");
  revalidatePath("/admin");
  revalidatePath("/notices");
  revalidatePath("/");
}

export async function createNotice(formData: FormData) {
  await requireAdmin();
  const fields = readNoticeFields(formData);
  const problem = invalid(fields);
  if (problem) redirect(`/admin/notices/new?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { error } = await supabase.from("notices").insert(fields);

  if (error) {
    redirect(`/admin/notices/new?error=${encodeURIComponent(error.message)}`);
  }

  refresh();
  redirect("/admin/notices?success=created");
}

export async function updateNotice(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readNoticeFields(formData);
  const problem = invalid(fields);
  if (problem) redirect(`/admin/notices/${id}?error=${encodeURIComponent(problem)}`);

  const supabase = await createClient();
  const { data: existing } = await supabase.from("notices").select("attachment_url").eq("id", id).maybeSingle();
  const { error } = await supabase
    .from("notices")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    redirect(`/admin/notices/${id}?error=${encodeURIComponent(error.message)}`);
  }

  // The old uploaded file is no longer linked from anywhere.
  const oldFile = noticeFilePath(existing?.attachment_url);
  if (oldFile && existing?.attachment_url !== fields.attachment_url) {
    await supabase.storage.from("public").remove([oldFile]);
  }

  refresh();
  redirect("/admin/notices?success=updated");
}

export async function deleteNotice(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: existing } = await supabase.from("notices").select("attachment_url").eq("id", id).maybeSingle();
  await supabase.from("notices").delete().eq("id", id);
  const oldFile = noticeFilePath(existing?.attachment_url);
  if (oldFile) await supabase.storage.from("public").remove([oldFile]);

  refresh();
}
