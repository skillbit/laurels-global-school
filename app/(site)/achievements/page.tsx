import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Board results, awards and achievements of students at The Laurels Global School.",
};

export default async function AchievementsPage() {
  const client = createPublicClient();
  const { data: items } = await client
    .from("achievements")
    .select("id, title, description, category, photo_path, achievement_date")
    .eq("is_published", true)
    .order("achievement_date", { ascending: false });

  return (
    <>
      <PageHeader crumb="Achievements" eyebrow="Results &amp; Achievements" title="Our Students&apos; Achievements" intro="Results and recognition earned by our students." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        {items && items.length > 0 ? (
          <div className="card-grid">
            {items.map((a) => (
              <article className="info-card" key={a.id}>
                {a.photo_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={client.storage.from("public").getPublicUrl(a.photo_path).data.publicUrl}
                    alt={a.title}
                    loading="lazy"
                  />
                )}
                <div className="body">
                <span className="meta">
                  {new Date(`${a.achievement_date}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {a.category ? ` · ${a.category}` : ""}
                </span>
                <h3>{a.title}</h3>
                {a.description && <p>{a.description}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
              <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
            </svg>
            <div>
              <h3>Achievements coming soon</h3>
              <p>Board results, awards and student achievements will be shared here.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
