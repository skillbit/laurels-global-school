import { createPublicClient } from "@/lib/supabase/public";

/** `pos` is the photo's place within its album, used to avoid showing burst shots side by side. */
export type Photo = { id: string; url: string; alt: string; albumId: string | null; pos: number };

/**
 * Every published photo from every published album (up to 300), in random order.
 * The browser shuffles again on each visit and picks photos that aren't near-duplicates.
 */
export async function getRandomPhotos(limit = 300): Promise<Photo[]> {
  const client = createPublicClient();
  const { data } = await client
    .from("gallery_images")
    .select("id, image_path, alt_text, album_id, sort_order, created_at, gallery_albums!inner(title, is_published)")
    .eq("is_published", true)
    .eq("gallery_albums.is_published", true)
    .order("album_id")
    .order("sort_order")
    .order("created_at")
    .limit(limit);

  // Position of each photo inside its album, in upload order.
  const seen = new Map<string, number>();
  const photos: Photo[] = (data ?? []).map((p) => {
    const album = Array.isArray(p.gallery_albums) ? p.gallery_albums[0] : p.gallery_albums;
    const key = p.album_id ?? "none";
    const pos = seen.get(key) ?? 0;
    seen.set(key, pos + 1);
    return {
      id: p.id,
      url: client.storage.from("public").getPublicUrl(p.image_path).data.publicUrl,
      alt: p.alt_text || album?.title || "Photo from The Laurels Global School",
      albumId: p.album_id,
      pos,
    };
  });

  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photos[i], photos[j]] = [photos[j], photos[i]];
  }
  return photos;
}
