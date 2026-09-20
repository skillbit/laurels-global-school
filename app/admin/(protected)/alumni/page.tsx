import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAlumnus, toggleAlumnusPublished } from "./actions";

const MESSAGES: Record<string, string> = {
  saved: "Alumni entry saved.",
  deleted: "Alumni entry deleted.",
};

export default async function AdminAlumniPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: alumni } = await supabase
    .from("alumni")
    .select("id, name, batch_year, sort_order, is_published, photo_path")
    .order("sort_order", { ascending: true })
    .order("batch_year", { ascending: false });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Alumni</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/alumni/new">
          Add Alumnus
        </Link>
      </div>

      {params.success && MESSAGES[params.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[params.success]}
        </p>
      )}

      {alumni && alumni.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Alumnus</th>
              <th>Batch</th>
              <th>Order</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {alumni.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                    {a.photo_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bucket.getPublicUrl(a.photo_path).data.publicUrl}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface-alt)", flex: "none" }}
                      />
                    )}
                    <strong>{a.name}</strong>
                  </div>
                </td>
                <td className="mono">{a.batch_year ?? "—"}</td>
                <td className="mono">{a.sort_order}</td>
                <td>
                  <span className={`badge ${a.is_published ? "badge-published" : "badge-draft"}`}>
                    {a.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className="btn btn-ghost btn-row" href={`/admin/alumni/${a.id}`}>
                    Edit
                  </Link>
                  <form action={toggleAlumnusPublished}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="next" value={(!a.is_published).toString()} />
                    <button className="btn btn-ghost btn-row" type="submit">
                      {a.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteAlumnus}>
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmDeleteButton confirmText={`Delete ${a.name}? This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No alumni yet — click &ldquo;Add Alumnus&rdquo; to feature a former student.</div>
      )}
    </>
  );
}
