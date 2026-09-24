import { createPublicClient } from "@/lib/supabase/public";

export type Photo = { id: string; url: string; alt: string; albumId: string | null };

/** Newest published photos from published albums, for the homepage collage and strip. */
export async function getRecentPhotos(limit: number): Promise<Photo[]> {
  const client = createPublicClient();
  const { data } = await client
    .from("gallery_images")
    .select("id, image_path, alt_text, album_id, gallery_albums!inner(title, is_published)")
    .eq("is_published", true)
    .eq("gallery_albums.is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((p) => {
    const album = Array.isArray(p.gallery_albums) ? p.gallery_albums[0] : p.gallery_albums;
    return {
      id: p.id,
      url: client.storage.from("public").getPublicUrl(p.image_path).data.publicUrl,
      alt: p.alt_text || album?.title || "Photo from The Laurels Global School",
      albumId: p.album_id,
    };
  });
}
