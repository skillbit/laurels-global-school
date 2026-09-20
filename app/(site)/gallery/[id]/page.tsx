import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";

type Props = { params: Promise<{ id: string }> };

async function getAlbum(id: string) {
  // Not a UUID → no such album (also avoids a database error for junk URLs).
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const client = createPublicClient();
  const { data: album } = await client
    .from("gallery_albums")
    .select("id, title, album_date")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  if (!album) return null;

  const { data: photos } = await client
    .from("gallery_images")
    .select("id, image_path, alt_text")
    .eq("album_id", id)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  return {
    album,
    photos: (photos ?? []).map((p) => ({
      ...p,
      url: client.storage.from("public").getPublicUrl(p.image_path).data.publicUrl,
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getAlbum(id);
  if (!data) return { title: "Album not found" };
  return {
    title: data.album.title,
    description: `Photos from ${data.album.title} at The Laurels Global School.`,
  };
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params;
  const data = await getAlbum(id);
  if (!data) notFound();
  const { album, photos } = data;

  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/gallery">Gallery</Link> / {album.title}
        </div>
        <span className="eyebrow">
          {new Date(`${album.album_date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
        <h1>{album.title}</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        {photos.length > 0 ? (
          <div className="photo-grid">
            {photos.map((p) => (
              <a href={p.url} target="_blank" rel="noopener noreferrer" key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.alt_text || album.title} loading="lazy" />
              </a>
            ))}
          </div>
        ) : (
          <div className="coming-soon">
            <div>
              <h3>No photos in this album yet</h3>
              <p>
                Check back soon, or <Link href="/gallery">browse other albums</Link>.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
