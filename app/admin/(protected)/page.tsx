import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [{ count: noticeCount }, { count: imageCount }, { count: staffCount }, { count: eventCount }, { count: documentCount }, { count: achievementCount }, { count: enquiryCount }, { count: adminCount }] = await Promise.all([
    supabase.from("notices").select("id", { count: "exact", head: true }),
    supabase.from("gallery_images").select("id", { count: "exact", head: true }),
    supabase.from("staff").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("admin_users").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      href: "/admin/notices",
      label: "Notices",
      count: noticeCount ?? 0,
      description: "Post announcements to the public Notices page.",
    },
    {
      href: "/admin/gallery",
      label: "Gallery",
      count: imageCount ?? 0,
      description: "Upload or remove campus and event photos.",
    },
    {
      href: "/admin/events",
      label: "Events",
      count: eventCount ?? 0,
      description: "Holidays, exams and school activities on the Events page.",
    },
    {
      href: "/admin/documents",
      label: "Documents",
      count: documentCount ?? 0,
      description: "Fee structure, admission forms, syllabus, circulars and newsletters.",
    },
    {
      href: "/admin/achievements",
      label: "Achievements",
      count: achievementCount ?? 0,
      description: "Board results, awards and student achievements.",
    },
    {
      href: "/admin/staff",
      label: "Staff",
      count: staffCount ?? 0,
      description: "Principal, leadership and faculty shown on the About page.",
    },
    {
      href: "/admin/enquiries",
      label: "Enquiries",
      count: enquiryCount ?? 0,
      description: "New admission enquiries from the Admissions page.",
    },
    {
      href: "/admin/settings",
      label: "Site Settings",
      description: "Banner, contact details, map, social links and homepage text.",
    },
    {
      href: "/admin/users",
      label: "Admin Accounts",
      count: adminCount ?? 0,
      description: "Manage who can log into this admin panel.",
    },
  ];

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Dashboard</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", marginBottom: "1.6rem" }}>
        Welcome to The Laurels Global School admin panel. More sections (Staff, Events, Documents
        and more) will appear here as they&apos;re built out.
      </p>
      <div className="admin-cards">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="value-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {c.count !== undefined && (
              <span className="mono" style={{ color: "var(--gold)", fontSize: "1.6rem" }}>
                {c.count}
              </span>
            )}
            <h3>{c.label}</h3>
            <p>{c.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
