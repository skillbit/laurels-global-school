import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteJobPosting, toggleJobPostingActive } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MESSAGES: Record<string, string> = {
  created: "Job posting created.",
  updated: "Job posting updated.",
  deleted: "Job posting deleted.",
};

export default async function AdminCareersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: postings } = await supabase
    .from("job_postings")
    .select("id, title, department, posted_date, is_active")
    .order("posted_date", { ascending: false });

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Careers</h1>
        </div>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <Link className={buttonVariants({ variant: "outline" })} href="/admin/careers/applications">
            View Applications
          </Link>
          <Link className={buttonVariants()} href="/admin/careers/new">
            New Job Posting
          </Link>
        </div>
      </div>

      {params.success && MESSAGES[params.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[params.success]}
        </p>
      )}

      {postings && postings.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Posted</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {postings.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                  {p.department && <div style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>{p.department}</div>}
                </td>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>
                  {p.posted_date}
                </td>
                <td>
                  <Badge variant={p.is_active ? "published" : "draft"}>
                    {p.is_active ? "Open" : "Closed"}
                  </Badge>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className={buttonVariants({ variant: "soft", size: "sm" })} href={`/admin/careers/${p.id}`}>
                    Edit
                  </Link>
                  <form action={toggleJobPostingActive}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="next" value={(!p.is_active).toString()} />
                    <button className={buttonVariants({ variant: "outline", size: "sm" })} type="submit">
                      {p.is_active ? "Close" : "Reopen"}
                    </button>
                  </form>
                  <form action={deleteJobPosting}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmDeleteButton confirmText={`Delete "${p.title}"? Applications already received are kept. This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No job postings yet — click &ldquo;New Job Posting&rdquo; to add an opening.</div>
      )}
    </>
  );
}
