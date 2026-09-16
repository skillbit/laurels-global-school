import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Campus and event photos from The Laurels Global School, Dehri-on-Sone.",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, image_path, caption, alt_text")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Gallery
        </div>
        <span className="eyebrow">Gallery &amp; Events</span>
        <h1>Life at Laurels</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        {images && images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((img) => {
              const { data: pub } = bucket.getPublicUrl(img.image_path);
              return (
                <div className="tile" key={img.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pub.publicUrl} alt={img.alt_text || img.caption || "Laurels campus photo"} loading="lazy" />
                </div>
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
              <h3>Photos coming soon</h3>
              <p>Campus and event photos will appear here once the school adds them from the admin panel.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
