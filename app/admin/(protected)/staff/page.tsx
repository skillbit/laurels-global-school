import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteStaff, toggleStaffPublished } from "./actions";

export default async function AdminStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff")
    .select("id, name, role, group_label, sort_order, is_published, photo_path")
    .order("group_label", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Staff</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/staff/new">
          Add Person
        </Link>
      </div>

      {params.success && (
        <p className="form-status ok" role="status">
          Staff member saved.
        </p>
      )}

      {staff && staff.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Group</th>
              <th>Order</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                    {p.photo_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bucket.getPublicUrl(p.photo_path).data.publicUrl}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface-alt)", flex: "none" }}
                      />
                    )}
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>{p.role}</div>
                    </div>
                  </div>
                </td>
                <td style={{ textTransform: "capitalize" }}>{p.group_label}</td>
                <td className="mono">{p.sort_order}</td>
                <td>
                  <span className={`badge ${p.is_published ? "badge-published" : "badge-draft"}`}>
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className="btn btn-ghost btn-row" href={`/admin/staff/${p.id}`}>
                    Edit
                  </Link>
                  <form action={toggleStaffPublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="next" value={(!p.is_published).toString()} />
                    <button className="btn btn-ghost btn-row" type="submit">
                      {p.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteStaff}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmDeleteButton confirmText={`Delete ${p.name}? This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No staff yet — click &ldquo;Add Person&rdquo; to add the principal and team.</div>
      )}
    </>
  );
}
