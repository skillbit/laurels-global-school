"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

// Grows as each admin section gets built (see project plan, Phases 3-4) —
// only sections that exist are linked here, to avoid dead links.
const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/notices", label: "Notices" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/careers/applications", label: "Job Applications" },
  { href: "/admin/alumni", label: "Alumni" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/branding", label: "Branding" },
  { href: "/admin/users", label: "Admin Accounts" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  // Highlight only the most specific matching section (Careers vs Job Applications).
  const activeHref = SECTIONS.filter((s) =>
    s.href === "/admin" ? pathname === s.href : pathname?.startsWith(s.href)
  ).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-who">
        Signed in as
        <br />
        <strong style={{ color: "var(--ink)" }}>{email}</strong>
      </div>
      <nav aria-label="Admin sections" style={{ display: "contents" }}>
        {SECTIONS.map((s) => {
          const isActive = s.href === activeHref;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={isActive ? "active" : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-signout">
        <SignOutButton />
      </div>
    </aside>
  );
}
