"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { PAGE_TEXT, maxLength } from "@/lib/page-content";

export async function savePageText(groupKey: string, formData: FormData) {
  await requireAdmin();
  const group = PAGE_TEXT.find((g) => g.key === groupKey);
  if (!group) redirect("/admin/page-text");

  const fail = (message: string): never =>
    redirect(`/admin/page-text?error=${encodeURIComponent(message)}#${group.key}`);

  const changed: { key: string; value: string; updated_at: string }[] = [];
  const reset: string[] = [];
  const now = new Date().toISOString();
  for (const field of group.fields) {
    const value = String(formData.get(field.key) || "").trim();
    if (value.length > maxLength(field)) fail(`“${field.label}” must be under ${maxLength(field)} characters.`);
    // An empty box, or the built-in text unchanged, means "use the built-in text".
    if (!value || value === field.text) reset.push(field.key);
    else changed.push({ key: field.key, value, updated_at: now });
  }

  const supabase = await createClient();
  if (changed.length > 0) {
    const { error } = await supabase.from("page_content").upsert(changed);
    if (error) fail(error.message);
  }
  if (reset.length > 0) {
    const { error } = await supabase.from("page_content").delete().in("key", reset);
    if (error) fail(error.message);
  }

  revalidatePath("/admin/page-text");
  for (const path of group.paths) revalidatePath(path);
  redirect(`/admin/page-text?success=${group.key}#${group.key}`);
}
