"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

// Grows as each admin section gets built (see project plan, Phases 3-4) —
// only sections that exist are linked here, to avoid dead links.
const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
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
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={pathname === s.href ? "active" : undefined}
            aria-current={pathname === s.href ? "page" : undefined}
          >
            {s.label}
          </Link>
        ))}
      </nav>
      <div className="admin-sidebar-signout">
        <SignOutButton />
      </div>
    </aside>
  );
}
