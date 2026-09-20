"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";
import AdminIcon, { type AdminIconName } from "./admin-icons";
import { WreathMark } from "@/components/site/WreathDefs";

type Item = { href: string; label: string; icon: AdminIconName };

const GROUPS: { title: string; items: Item[] }[] = [
  { title: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }] },
  {
    title: "Content",
    items: [
      { href: "/admin/notices", label: "Notices", icon: "notices" },
      { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
      { href: "/admin/events", label: "Events", icon: "events" },
      { href: "/admin/documents", label: "Documents", icon: "documents" },
      { href: "/admin/achievements", label: "Achievements", icon: "achievements" },
      { href: "/admin/alumni", label: "Alumni", icon: "alumni" },
      { href: "/admin/staff", label: "Staff", icon: "staff" },
    ],
  },
  {
    title: "Inbox",
    items: [
      { href: "/admin/enquiries", label: "Enquiries", icon: "enquiries" },
      { href: "/admin/careers", label: "Careers", icon: "careers" },
      { href: "/admin/careers/applications", label: "Job Applications", icon: "applications" },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/admin/settings", label: "Site Settings", icon: "settings" },
      { href: "/admin/branding", label: "Branding", icon: "branding" },
      { href: "/admin/users", label: "Admin Accounts", icon: "users" },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.items);

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  // Highlight only the most specific matching section (Careers vs Job Applications).
  const activeHref = ALL.filter((s) =>
    s.href === "/admin" ? pathname === s.href : pathname?.startsWith(s.href)
  ).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        <span className="badge-mark">
          <WreathMark />
        </span>
        <div>
          <strong>The Laurels</strong>
          <small>Admin panel</small>
        </div>
      </Link>
      <nav aria-label="Admin sections" style={{ display: "contents" }}>
        {GROUPS.map((g) => (
          <div className="admin-nav-group" key={g.title}>
            <span className="admin-nav-title">{g.title}</span>
            {g.items.map((s) => {
              const isActive = s.href === activeHref;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={isActive ? "active" : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <AdminIcon name={s.icon} />
                  {s.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-who">
        Signed in as
        <br />
        <strong>{email}</strong>
      </div>
      <div className="admin-sidebar-signout">
        <SignOutButton />
      </div>
    </aside>
  );
}
