import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/site/PageHeader";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo albums from events and campus life at The Laurels Global School, Dehri-on-Sone.",
};

export default async function GalleryPage() {
  const client = createPublicClient();
  const { data: albums } = await client
    .from("gallery_albums")
    .select("id, title, album_date, gallery_images(image_path, sort_order)")
    .eq("is_published", true)
    .order("album_date", { ascending: false });

  // Only show albums that already have photos.
  const visible = (albums ?? []).filter((a) => a.gallery_images.length > 0);

  return (
    <>
      <PageHeader crumb="Gallery" eyebrow="Gallery &amp; Events" title="Life at Laurels" intro="Photo albums from school events and campus life." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        {visible.length > 0 ? (
          <div className="album-grid">
            {visible.map((a) => {
              const photos = [...a.gallery_images].sort((x, y) => x.sort_order - y.sort_order);
              return (
                <Link className="album-card" href={`/gallery/${a.id}`} key={a.id}>
                  <div className="album-cover">
                    <Image
                      src={client.storage.from("public").getPublicUrl(photos[0].image_path).data.publicUrl}
                      alt={`${a.title} — cover photo`}
                      fill
                      sizes="(max-width: 520px) 100vw, (max-width: 860px) 50vw, 380px"
                    />
                  </div>
                  <div className="album-meta">
                    <h3>{a.title}</h3>
                    <span>
                      {new Date(`${a.album_date}T00:00:00`).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {photos.length} {photos.length === 1 ? "photo" : "photos"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 20c8-1 14-7 15-15-8 1-14 7-15 15Z" />
              <path d="M6 18C9 13 13 9 18 6" />
            </svg>
            <div>
              <h2>Photos coming soon</h2>
              <p>Photo albums from school events and campus life will appear here.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
