import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AlbumForm from "@/components/admin/AlbumForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAlbum, deleteAlbumPhoto } from "../actions";

export default async function EditAlbumPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const { data: album } = await supabase
    .from("gallery_albums")
    .select("id, title, album_date, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!album) notFound();

  const { data: photos } = await supabase
    .from("gallery_images")
    .select("id, image_path")
    .eq("album_id", id)
    .order("sort_order", { ascending: true });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit Album</h1>
      </div>
      {query.error && (
        <p className="form-status err" role="alert">
          {query.error}
        </p>
      )}
      <AlbumForm album={album} submitLabel="Save Changes" />

      <h2 style={{ fontSize: "1.2rem", margin: "2rem 0 .8rem" }}>Photos in this album ({photos?.length ?? 0})</h2>
      {photos && photos.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: ".8rem" }}>
          {photos.map((p) => (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bucket.getPublicUrl(p.image_path).data.publicUrl}
                alt=""
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }}
              />
              <form action={deleteAlbumPhoto}>
                <input type="hidden" name="id" value={p.id} />
                <ConfirmDeleteButton label="Remove photo" confirmText="Remove this photo? This can't be undone." />
              </form>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">No photos yet — add some with the form above.</div>
      )}

      <form action={deleteAlbum} style={{ marginTop: "2rem" }}>
        <input type="hidden" name="id" value={album.id} />
        <ConfirmDeleteButton label="Delete Album" confirmText={`Delete the album "${album.title}" and all its photos? This can't be undone.`} />
      </form>
    </>
  );
}
