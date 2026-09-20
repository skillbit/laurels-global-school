"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type AlumniInput = {
  name: string;
  batch_year: number | null;
  note: string;
  sort_order: number;
  is_published: boolean;
  photo_path: string | null;
};

function refresh() {
  revalidatePath("/admin/alumni");
  revalidatePath("/admin");
  revalidatePath("/alumni");
}

export async function saveAlumnus(id: string | null, input: AlumniInput): Promise<{ error?: string }> {
  await requireAdmin();

  const name = input.name.trim();
  const note = input.note.trim();
  if (!name) return { error: "Name is required." };
  if (name.length > 100) return { error: "Name must be under 100 characters." };
  if (note.length > 1000) return { error: "Note must be under 1000 characters." };
  const currentYear = new Date().getFullYear();
  if (input.batch_year !== null && (!Number.isInteger(input.batch_year) || input.batch_year < 1980 || input.batch_year > currentYear + 1)) {
    return { error: `Batch year must be between 1980 and ${currentYear + 1}.` };
  }
  // Photos are uploaded from the browser; only accept paths inside alumni/.
  if (input.photo_path !== null && !/^alumni\/[\w-]+\.\w+$/.test(input.photo_path)) {
    return { error: "Invalid photo." };
  }

  const fields = {
    name,
    batch_year: input.batch_year,
    note: note || null,
    sort_order: Number.isFinite(input.sort_order) ? Math.trunc(input.sort_order) : 0,
    is_published: input.is_published,
    photo_path: input.photo_path,
  };

  const supabase = await createClient();

  if (id) {
    const { data: existing } = await supabase.from("alumni").select("photo_path").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("alumni")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    if (existing?.photo_path && existing.photo_path !== fields.photo_path) {
      await supabase.storage.from("public").remove([existing.photo_path]);
    }
  } else {
    const { error } = await supabase.from("alumni").insert(fields);
    if (error) return { error: error.message };
  }

  refresh();
  return {};
}

export async function deleteAlumnus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: existing } = await supabase.from("alumni").select("photo_path").eq("id", id).maybeSingle();
  if (existing?.photo_path) await supabase.storage.from("public").remove([existing.photo_path]);
  await supabase.from("alumni").delete().eq("id", id);

  refresh();
  redirect("/admin/alumni?success=deleted");
}

export async function toggleAlumnusPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("alumni").update({ is_published: next }).eq("id", id);

  refresh();
}
