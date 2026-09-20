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
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "Admin Accounts" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-who">
        Signed in as
        <br />
        <strong style={{ color: "var(--ink)" }}>{email}</strong>
      </div>
      <nav aria-label="Admin sections" style={{ display: "contents" }}>
        {SECTIONS.map((s) => {
          const isActive = s.href === "/admin" ? pathname === s.href : pathname?.startsWith(s.href);
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
