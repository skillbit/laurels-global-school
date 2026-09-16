import Link from "next/link";
import SignOutButton from "./SignOutButton";

// Grows as each admin section gets built (see project plan, Phases 3-4) —
// only sections that exist are linked here, to avoid dead links.
const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Admin Accounts" },
];

export default function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="admin-sidebar">
      <div style={{ padding: ".6rem .8rem 1rem", fontSize: ".8rem", color: "var(--ink-faint)" }}>
        Signed in as
        <br />
        <strong style={{ color: "var(--ink)" }}>{email}</strong>
      </div>
      {SECTIONS.map((s) => (
        <Link key={s.href} href={s.href}>
          {s.label}
        </Link>
      ))}
      <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
        <SignOutButton />
      </div>
    </aside>
  );
}
