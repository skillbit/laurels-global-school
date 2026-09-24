import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAlbum, toggleAlbumPublished } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MESSAGES: Record<string, string> = {
  created: "Album created.",
  deleted: "Album deleted.",
};

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: albums, error } = await supabase
    .from("gallery_albums")
    .select("id, title, album_date, is_published, gallery_images(image_path, sort_order)")
    .order("album_date", { ascending: false });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Gallery</h1>
        </div>
        <Link className={buttonVariants()} href="/admin/gallery/new">
          New Album
        </Link>
      </div>

      {params.success && MESSAGES[params.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[params.success]}
        </p>
      )}
      {error && (
        <p className="form-status err" role="alert">
          Couldn&apos;t load albums: {error.message}. If this is new, run supabase/migrations/0002_gallery_albums.sql in the Supabase SQL editor.
        </p>
      )}

      {albums && albums.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Album</th>
              <th>Date</th>
              <th>Photos</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {albums.map((a) => {
              const photos = [...a.gallery_images].sort((x, y) => x.sort_order - y.sort_order);
              const cover = photos[0]?.image_path;
              return (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={bucket.getPublicUrl(cover).data.publicUrl}
                          alt=""
                          style={{ width: 56, height: 40, borderRadius: 6, objectFit: "cover" }}
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          style={{ width: 56, height: 40, borderRadius: 6, background: "var(--surface-alt)", flex: "none" }}
                        />
                      )}
                      <strong>{a.title}</strong>
                    </div>
                  </td>
                  <td className="mono" style={{ whiteSpace: "nowrap" }}>
                    {a.album_date}
                  </td>
                  <td className="mono">{photos.length}</td>
                  <td>
                    <Badge variant={a.is_published ? "published" : "draft"}>
                      {a.is_published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <Link className={buttonVariants({ variant: "soft", size: "sm" })} href={`/admin/gallery/${a.id}`}>
                      Edit
                    </Link>
                    <form action={toggleAlbumPublished}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="next" value={(!a.is_published).toString()} />
                      <button className={buttonVariants({ variant: "outline", size: "sm" })} type="submit">
                        {a.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteAlbum}>
                      <input type="hidden" name="id" value={a.id} />
                      <ConfirmDeleteButton confirmText={`Delete the album "${a.title}" and all ${photos.length} of its photos? This can't be undone.`} />
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !error && <div className="admin-empty">No albums yet — click &ldquo;New Album&rdquo; to add a title and upload photos.</div>
      )}
    </>
  );
}
