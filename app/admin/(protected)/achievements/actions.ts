"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type AchievementInput = {
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  is_published: boolean;
  photo_path: string | null;
};

function refresh() {
  revalidatePath("/admin/achievements");
  revalidatePath("/admin");
  revalidatePath("/achievements");
}

export async function saveAchievement(id: string | null, input: AchievementInput): Promise<{ error?: string }> {
  await requireAdmin();

  const title = input.title.trim();
  const description = input.description.trim();
  const category = input.category.trim();
  if (!title) return { error: "Title is required." };
  if (title.length > 150) return { error: "Title must be under 150 characters." };
  if (description.length > 1000) return { error: "Description must be under 1000 characters." };
  if (category.length > 40) return { error: "Category must be under 40 characters." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.achievement_date)) return { error: "Choose a valid date." };
  // Photos are uploaded from the browser; only accept paths inside achievements/.
  if (input.photo_path !== null && !/^achievements\/[\w-]+\.\w+$/.test(input.photo_path)) {
    return { error: "Invalid photo." };
  }

  const fields = {
    title,
    description: description || null,
    category: category || null,
    achievement_date: input.achievement_date,
    is_published: input.is_published,
    photo_path: input.photo_path,
  };

  const supabase = await createClient();

  if (id) {
    const { data: existing } = await supabase.from("achievements").select("photo_path").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("achievements")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    if (existing?.photo_path && existing.photo_path !== fields.photo_path) {
      await supabase.storage.from("public").remove([existing.photo_path]);
    }
  } else {
    const { error } = await supabase.from("achievements").insert(fields);
    if (error) return { error: error.message };
  }

  refresh();
  return {};
}

export async function deleteAchievement(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: existing } = await supabase.from("achievements").select("photo_path").eq("id", id).maybeSingle();
  if (existing?.photo_path) await supabase.storage.from("public").remove([existing.photo_path]);
  await supabase.from("achievements").delete().eq("id", id);

  refresh();
  redirect("/admin/achievements?success=deleted");
}

export async function toggleAchievementPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("achievements").update({ is_published: next }).eq("id", id);

  refresh();
}
