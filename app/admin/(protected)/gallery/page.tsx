import { createClient } from "@/lib/supabase/server";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteGalleryImage, toggleGalleryPublished } from "./actions";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, image_path, caption, is_published, sort_order")
    .order("sort_order", { ascending: true });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Gallery</h1>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <GalleryUploadForm />
      </div>

      {images && images.length > 0 ? (
        <div className="gallery-grid" style={{ gridAutoRows: "180px" }}>
          {images.map((img) => {
            const { data: pub } = bucket.getPublicUrl(img.image_path);
            return (
              <div className="tile" key={img.id} style={{ background: "var(--surface-alt)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pub.publicUrl} alt={img.caption ?? ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div
                  style={{
                    position: "absolute", inset: 0, zIndex: 2,
                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                    padding: ".6rem", gap: ".4rem",
                    background: "linear-gradient(to top, rgba(0,0,0,.65), transparent 60%)",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: ".78rem" }}>{img.caption || "—"}</span>
                  <div style={{ display: "flex", gap: ".4rem" }}>
                    <form action={toggleGalleryPublished}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="hidden" name="next" value={(!img.is_published).toString()} />
                      <button className="btn btn-ghost btn-row" type="submit" style={{ background: "rgba(255,255,255,.9)" }}>
                        {img.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteGalleryImage}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="hidden" name="image_path" value={img.image_path} />
                      <ConfirmDeleteButton
                        confirmText="Delete this photo? This can't be undone."
                        style={{ background: "rgba(255,255,255,.9)" }}
                      />
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty">No photos yet — upload one above.</div>
      )}
    </>
  );
}
