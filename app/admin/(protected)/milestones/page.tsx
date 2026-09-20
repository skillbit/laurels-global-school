import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteMilestone, toggleMilestonePublished } from "./actions";

const MESSAGES: Record<string, string> = {
  created: "Milestone added.",
  updated: "Milestone updated.",
  deleted: "Milestone deleted.",
};

export default async function AdminMilestonesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: milestones, error } = await supabase
    .from("milestones")
    .select("id, year, title, description, is_published")
    .order("year", { ascending: true });

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>History</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/milestones/new">
          Add Milestone
        </Link>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", marginBottom: "1.2rem" }}>
        Milestones appear as a timeline on the About page, oldest first.
      </p>

      {params.success && MESSAGES[params.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[params.success]}
        </p>
      )}
      {error && (
        <p className="form-status err" role="alert">
          Couldn&apos;t load milestones: {error.message}. If this is new, run supabase/migrations/0003_milestones.sql in the Supabase SQL editor.
        </p>
      )}

      {milestones && milestones.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Milestone</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => (
              <tr key={m.id}>
                <td className="mono">
                  <strong>{m.year}</strong>
                </td>
                <td>
                  <strong>{m.title}</strong>
                  {m.description && (
                    <div style={{ color: "var(--ink-soft)", fontSize: ".85rem", marginTop: ".2rem", maxWidth: "44ch" }}>
                      {m.description}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`badge ${m.is_published ? "badge-published" : "badge-draft"}`}>
                    {m.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className="btn btn-ghost btn-row" href={`/admin/milestones/${m.id}`}>
                    Edit
                  </Link>
                  <form action={toggleMilestonePublished}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="next" value={(!m.is_published).toString()} />
                    <button className="btn btn-ghost btn-row" type="submit">
                      {m.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteMilestone}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmDeleteButton confirmText={`Delete "${m.title}"? This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && (
          <div className="admin-empty">
            No milestones yet — click &ldquo;Add Milestone&rdquo; to add the founding year, CBSE affiliation and other key moments.
          </div>
        )
      )}
    </>
  );
}
