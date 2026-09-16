"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function readNoticeFields(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    body: String(formData.get("body") || "").trim(),
    notice_date: String(formData.get("notice_date") || "") || undefined,
    attachment_url: String(formData.get("attachment_url") || "").trim() || null,
    is_published: formData.get("is_published") === "on",
  };
}

export async function createNotice(formData: FormData) {
  await requireAdmin();
  const fields = readNoticeFields(formData);

  if (!fields.title || !fields.body) {
    redirect(`/admin/notices/new?error=${encodeURIComponent("Title and body are required.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notices").insert(fields);

  if (error) {
    redirect(`/admin/notices/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  redirect("/admin/notices?success=created");
}

export async function updateNotice(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readNoticeFields(formData);

  if (!fields.title || !fields.body) {
    redirect(`/admin/notices/${id}?error=${encodeURIComponent("Title and body are required.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notices")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    redirect(`/admin/notices/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  redirect("/admin/notices?success=updated");
}

export async function deleteNotice(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  await supabase.from("notices").delete().eq("id", id);

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
}
