import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminIcon, { type AdminIconName } from "@/components/admin/admin-icons";

type Card = {
  href: string;
  label: string;
  icon: AdminIconName;
  count?: number;
  description: string;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const count = async (table: string, filter?: [string, string | boolean]) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count: n } = await q;
    return n ?? 0;
  };

  const [notices, albums, events, documents, achievements, alumni, staff, openJobs, admins, newEnquiries, newApplications] =
    await Promise.all([
      count("notices"),
      count("gallery_albums"),
      count("events"),
      count("documents"),
      count("achievements"),
      count("alumni"),
      count("staff"),
      count("job_postings", ["is_active", true]),
      count("admin_users"),
      count("enquiries", ["status", "new"]),
      count("career_applications", ["status", "new"]),
    ]);

  const attention = [
    {
      href: "/admin/enquiries",
      n: newEnquiries,
      label: newEnquiries === 1 ? "new admission enquiry" : "new admission enquiries",
      hint: "Parents waiting for a callback",
    },
    {
      href: "/admin/careers/applications",
      n: newApplications,
      label: newApplications === 1 ? "new job application" : "new job applications",
      hint: "Candidates and resumes to review",
    },
  ];

  const groups: { title: string; cards: Card[] }[] = [
    {
      title: "Content",
      cards: [
        { href: "/admin/notices", label: "Notices", icon: "notices", count: notices, description: "Post announcements to the Notices page." },
        { href: "/admin/gallery", label: "Gallery", icon: "gallery", count: albums, description: "Photo albums for events and campus life." },
        { href: "/admin/events", label: "Events", icon: "events", count: events, description: "Holidays, exams and school activities." },
        { href: "/admin/documents", label: "Documents", icon: "documents", count: documents, description: "Fee structure, forms, syllabus and circulars." },
        { href: "/admin/achievements", label: "Achievements", icon: "achievements", count: achievements, description: "Board results, awards and student wins." },
        { href: "/admin/alumni", label: "Alumni", icon: "alumni", count: alumni, description: "Former students featured on the Alumni page." },
        { href: "/admin/staff", label: "Staff", icon: "staff", count: staff, description: "Principal, leadership and faculty on the About page." },
      ],
    },
    {
      title: "Hiring",
      cards: [
        { href: "/admin/careers", label: "Careers", icon: "careers", count: openJobs, description: "Open job postings on the Careers page." },
      ],
    },
    {
      title: "Site",
      cards: [
        { href: "/admin/settings", label: "Site Settings", icon: "settings", description: "Banner, contact details, map, social links and homepage text." },
        { href: "/admin/branding", label: "Branding", icon: "branding", description: "School logo and browser-tab icon." },
        { href: "/admin/users", label: "Admin Accounts", icon: "users", count: admins, description: "Who can sign in to this admin panel." },
      ],
    },
  ];

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Dashboard</h1>
      </div>
      <p className="dash-intro">Everything you can change on the public site, in one place. Start with anything that needs a reply.</p>

      <div className="dash-attn">
        {attention.map((a) => (
          <Link key={a.href} href={a.href} className={a.n === 0 ? "quiet" : undefined}>
            <span className="n">{a.n}</span>
            <span className="l">{a.label}</span>
            <span className="h">{a.n === 0 ? "You're all caught up" : a.hint}</span>
          </Link>
        ))}
      </div>

      {groups.map((g) => (
        <section className="dash-group" key={g.title} style={{ padding: 0 }}>
          <h2>{g.title}</h2>
          <div className="dash-grid">
            {g.cards.map((c) => (
              <Link key={c.href} href={c.href} className="dash-card">
                <div className="top">
                  <span className="ico">
                    <AdminIcon name={c.icon} />
                  </span>
                  {c.count !== undefined && <span className="count">{c.count}</span>}
                </div>
                <h3>{c.label}</h3>
                <p>{c.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
