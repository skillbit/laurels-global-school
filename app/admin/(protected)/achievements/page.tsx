import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAchievement, toggleAchievementPublished } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MESSAGES: Record<string, string> = {
  saved: "Achievement saved.",
  deleted: "Achievement deleted.",
};

export default async function AdminAchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("achievements")
    .select("id, title, category, achievement_date, is_published, photo_path")
    .order("achievement_date", { ascending: false });

  const bucket = supabase.storage.from("public");

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Achievements</h1>
        </div>
        <Link className={buttonVariants()} href="/admin/achievements/new">
          New Achievement
        </Link>
      </div>

      {params.success && MESSAGES[params.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[params.success]}
        </p>
      )}

      {items && items.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                    {a.photo_path && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bucket.getPublicUrl(a.photo_path).data.publicUrl}
                        alt=""
                        style={{ width: 56, height: 40, borderRadius: 6, objectFit: "cover" }}
                      />
                    )}
                    <strong>{a.title}</strong>
                  </div>
                </td>
                <td>{a.category ?? "—"}</td>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>
                  {a.achievement_date}
                </td>
                <td>
                  <Badge variant={a.is_published ? "published" : "draft"}>
                    {a.is_published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className={buttonVariants({ variant: "soft", size: "sm" })} href={`/admin/achievements/${a.id}`}>
                    Edit
                  </Link>
                  <form action={toggleAchievementPublished}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="next" value={(!a.is_published).toString()} />
                    <button className={buttonVariants({ variant: "outline", size: "sm" })} type="submit">
                      {a.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteAchievement}>
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmDeleteButton confirmText={`Delete "${a.title}"? This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No achievements yet — click &ldquo;New Achievement&rdquo; to add results, awards or wins.</div>
      )}
    </>
  );
}
