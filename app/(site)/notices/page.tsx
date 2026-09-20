import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Notices",
  description: "Latest notices, circulars and announcements from The Laurels Global School, Dehri-on-Sone.",
};

export default async function NoticesPage() {
  const supabase = await createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, body, notice_date, attachment_url")
    .eq("is_published", true)
    .order("notice_date", { ascending: false });

  return (
    <>
      <PageHeader crumb="Notices" eyebrow="Notices &amp; Announcements" title="Latest from the School" intro="Announcements, circulars and important dates from the school office." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        {notices && notices.length > 0 ? (
          <div className="notice-list">
            {notices.map((n) => (
              <div className="notice" key={n.id}>
                <span className="date mono">
                  {new Date(n.notice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                  {n.attachment_url && (
                    <a href={n.attachment_url} style={{ color: "var(--laurel)", fontSize: ".85rem", fontWeight: 600 }}>
                      View attachment &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 5h16v11H8l-4 4V5Z" />
            </svg>
            <div>
              <h2>No notices posted yet</h2>
              <p>Check back soon — announcements will appear here as the school posts them.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
