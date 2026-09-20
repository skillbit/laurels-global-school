"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type AlbumInput = {
  title: string;
  album_date: string;
  is_published: boolean;
};

function refresh() {
  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/gallery", "layout");
}

function validate(input: AlbumInput) {
  const title = input.title.trim();
  if (!title) return "Album title is required.";
  if (title.length > 120) return "Album title must be under 120 characters.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.album_date)) return "Choose a valid date.";
  return null;
}

export async function createAlbum(input: AlbumInput): Promise<{ id?: string; error?: string }> {
  await requireAdmin();
  const problem = validate(input);
  if (problem) return { error: problem };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_albums")
    .insert({ title: input.title.trim(), album_date: input.album_date, is_published: input.is_published })
    .select("id")
    .single();
  if (error) return { error: error.message };

  refresh();
  return { id: data.id };
}

export async function updateAlbum(id: string, input: AlbumInput): Promise<{ error?: string }> {
  await requireAdmin();
  const problem = validate(input);
  if (problem) return { error: problem };

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_albums")
    .update({
      title: input.title.trim(),
      album_date: input.album_date,
      is_published: input.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.message };

  refresh();
  return {};
}

// Photos are uploaded from the browser straight to storage (avoids the Server
// Action body limit); this records them against the album.
export async function addAlbumPhotos(albumId: string, paths: string[]): Promise<{ error?: string }> {
  await requireAdmin();
  if (paths.length === 0) return {};
  const valid = new RegExp(`^gallery/${albumId}/[\\w-]+\\.\\w+$`);
  if (!paths.every((p) => valid.test(p))) return { error: "Invalid photo path." };

  const supabase = await createClient();
  const { data: album } = await supabase.from("gallery_albums").select("title").eq("id", albumId).maybeSingle();
  if (!album) return { error: "Album not found." };

  const { data: last } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const start = (last?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("gallery_images").insert(
    paths.map((image_path, i) => ({
      album_id: albumId,
      image_path,
      alt_text: `${album.title} — photo ${start + i + 1}`,
      sort_order: start + i,
      is_published: true,
    }))
  );
  if (error) return { error: error.message };

  refresh();
  return {};
}

export async function deleteAlbumPhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: photo } = await supabase.from("gallery_images").select("image_path").eq("id", id).maybeSingle();
  if (photo?.image_path) await supabase.storage.from("public").remove([photo.image_path]);
  await supabase.from("gallery_images").delete().eq("id", id);

  refresh();
}

export async function deleteAlbum(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: photos } = await supabase.from("gallery_images").select("image_path").eq("album_id", id);
  const paths = (photos ?? []).map((p) => p.image_path);
  if (paths.length > 0) await supabase.storage.from("public").remove(paths);
  // Photo rows are removed by the album_id foreign key (on delete cascade).
  await supabase.from("gallery_albums").delete().eq("id", id);

  refresh();
  redirect("/admin/gallery?success=deleted");
}

export async function toggleAlbumPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("gallery_albums").update({ is_published: next }).eq("id", id);

  refresh();
}
