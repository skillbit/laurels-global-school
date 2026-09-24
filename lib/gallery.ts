import { createPublicClient } from "@/lib/supabase/public";

export type Photo = { id: string; url: string; alt: string; albumId: string | null };

/**
 * A random selection of published photos from any published album. Pages are
 * pre-built and refreshed every minute, so each refresh picks a new selection from
 * the whole gallery; the browser then shuffles it again on every visit.
 */
export async function getRandomPhotos(count: number): Promise<Photo[]> {
  const client = createPublicClient();
  const { data } = await client
    .from("gallery_images")
    .select("id, image_path, alt_text, album_id, gallery_albums!inner(title, is_published)")
    .eq("is_published", true)
    .eq("gallery_albums.is_published", true)
    .limit(2000);

  const all = [...(data ?? [])];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.slice(0, count).map((p) => {
    const album = Array.isArray(p.gallery_albums) ? p.gallery_albums[0] : p.gallery_albums;
    return {
      id: p.id,
      url: client.storage.from("public").getPublicUrl(p.image_path).data.publicUrl,
      alt: p.alt_text || album?.title || "Photo from The Laurels Global School",
      albumId: p.album_id,
    };
  });
}
