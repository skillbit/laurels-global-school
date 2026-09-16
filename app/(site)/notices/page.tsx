import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notices",
  description: "Latest notices and announcements from The Laurels Global School.",
};

// Placeholder rows — Phase 3 wires this list to the `notices` Supabase table,
// managed from /admin/notices.
const PLACEHOLDER_NOTICES = [
  {
    date: "TODO",
    tag: "Admissions",
    title: "Admissions open for the current academic year",
    body: "Nursery to Class 10 — call the office or use the admissions enquiry form to begin.",
  },
  {
    date: "TODO",
    tag: "General",
    title: "This is a placeholder notice",
    body: "Real notices posted from the admin panel will replace this list automatically.",
  },
];

export default function NoticesPage() {
  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Notices
        </div>
        <span className="eyebrow">Notices &amp; Announcements</span>
        <h1>Latest from the School</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="notice-list">
          {PLACEHOLDER_NOTICES.map((n) => (
            <div className="notice" key={n.title}>
              <span className="date mono">{n.date}</span>
              <div>
                <h3>{n.title}</h3>
                <p>{n.body}</p>
              </div>
              <span className="tag">{n.tag}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
