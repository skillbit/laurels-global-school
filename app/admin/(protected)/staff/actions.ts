"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type StaffInput = {
  name: string;
  role: string;
  bio: string;
  group_label: string;
  sort_order: number;
  is_published: boolean;
  photo_path: string | null;
};

function refresh() {
  revalidatePath("/admin/staff");
  revalidatePath("/admin");
  revalidatePath("/about");
}

// Photos are uploaded from the browser (avoids the Server Action body limit);
// this action only stores the resulting path, so it must stay inside staff/.
function validPhotoPath(path: string | null) {
  return path === null || /^staff\/[\w-]+\.\w+$/.test(path);
}

export async function saveStaff(id: string | null, input: StaffInput): Promise<{ error?: string }> {
  await requireAdmin();

  const name = input.name.trim();
  const role = input.role.trim();
  const bio = input.bio.trim();
  if (!name || !role) return { error: "Name and role are required." };
  if (name.length > 100 || role.length > 100) return { error: "Name and role must be under 100 characters." };
  if (bio.length > 1000) return { error: "Bio must be under 1000 characters." };
  if (!["leadership", "faculty"].includes(input.group_label)) return { error: "Choose a valid group." };
  if (!validPhotoPath(input.photo_path)) return { error: "Invalid photo." };

  const fields = {
    name,
    role,
    bio: bio || null,
    group_label: input.group_label,
    sort_order: Number.isFinite(input.sort_order) ? Math.trunc(input.sort_order) : 0,
    is_published: input.is_published,
    photo_path: input.photo_path,
  };

  const supabase = await createClient();

  if (id) {
    const { data: existing } = await supabase.from("staff").select("photo_path").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("staff")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    // Photo replaced or removed — clean up the old file.
    if (existing?.photo_path && existing.photo_path !== fields.photo_path) {
      await supabase.storage.from("public").remove([existing.photo_path]);
    }
  } else {
    const { error } = await supabase.from("staff").insert(fields);
    if (error) return { error: error.message };
  }

  refresh();
  return {};
}

export async function deleteStaff(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: existing } = await supabase.from("staff").select("photo_path").eq("id", id).maybeSingle();
  if (existing?.photo_path) await supabase.storage.from("public").remove([existing.photo_path]);
  await supabase.from("staff").delete().eq("id", id);

  refresh();
  redirect("/admin/staff");
}

export async function toggleStaffPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("staff").update({ is_published: next }).eq("id", id);

  refresh();
}
