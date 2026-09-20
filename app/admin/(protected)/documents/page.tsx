import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { categoryLabel, fileExtension } from "@/lib/documents";
import { deleteDocument, toggleDocumentPublished } from "./actions";

const MESSAGES: Record<string, string> = {
  saved: "Document saved.",
  deleted: "Document deleted.",
};

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("id, title, category, file_path, published_date, is_published")
    .order("published_date", { ascending: false });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Documents</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/documents/new">
          Upload Document
        </Link>
      </div>

      {params.success && MESSAGES[params.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[params.success]}
        </p>
      )}

      {documents && documents.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d.id}>
                <td>
                  <a
                    href={bucket.getPublicUrl(d.file_path).data.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--laurel-deep)", fontWeight: 600 }}
                  >
                    {d.title}
                  </a>{" "}
                  <span className="mono" style={{ color: "var(--ink-faint)", fontSize: ".75rem" }}>
                    {fileExtension(d.file_path)}
                  </span>
                </td>
                <td>{categoryLabel(d.category)}</td>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>
                  {d.published_date}
                </td>
                <td>
                  <span className={`badge ${d.is_published ? "badge-published" : "badge-draft"}`}>
                    {d.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className="btn btn-ghost btn-row" href={`/admin/documents/${d.id}`}>
                    Edit
                  </Link>
                  <form action={toggleDocumentPublished}>
                    <input type="hidden" name="id" value={d.id} />
                    <input type="hidden" name="next" value={(!d.is_published).toString()} />
                    <button className="btn btn-ghost btn-row" type="submit">
                      {d.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteDocument}>
                    <input type="hidden" name="id" value={d.id} />
                    <ConfirmDeleteButton confirmText={`Delete "${d.title}" and its file? This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No documents yet — click &ldquo;Upload Document&rdquo; to add a fee structure, form or circular.</div>
      )}
    </>
  );
}
