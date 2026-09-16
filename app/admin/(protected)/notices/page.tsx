import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteNotice } from "./actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminNoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, notice_date, is_published")
    .order("notice_date", { ascending: false });

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Notices</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/notices/new">
          New Notice
        </Link>
      </div>

      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      {params.success && (
        <p className="form-status ok" role="status">
          Notice {params.success === "created" ? "created" : "updated"}.
        </p>
      )}

      {notices && notices.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n) => (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td className="mono">{n.notice_date}</td>
                <td>
                  <span className={`badge ${n.is_published ? "badge-published" : "badge-draft"}`}>
                    {n.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className="btn btn-ghost btn-row" href={`/admin/notices/${n.id}`}>
                    Edit
                  </Link>
                  <form action={deleteNotice}>
                    <input type="hidden" name="id" value={n.id} />
                    <ConfirmDeleteButton confirmText={`Delete "${n.title}"? This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No notices yet — click &ldquo;New Notice&rdquo; to add one.</div>
      )}
    </>
  );
}
