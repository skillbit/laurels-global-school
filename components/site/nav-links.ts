// Single source for the site menu. The header shows these (groups become dropdowns)
// and the footer lists the same groups, so every public page is reachable from both.
export type NavLink = { href: string; label: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  {
    label: "About",
    children: [
      { href: "/about", label: "Our school" },
      { href: "/achievements", label: "Achievements" },
      { href: "/alumni", label: "Alumni" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    label: "Academics",
    children: [
      { href: "/academics", label: "Curriculum & facilities" },
      { href: "/documents", label: "Fees & documents" },
    ],
  },
  { href: "/admissions", label: "Admissions" },
  {
    label: "School life",
    children: [
      { href: "/events", label: "Events" },
      { href: "/notices", label: "Notices" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export function isGroup(item: NavItem): item is { label: string; children: NavLink[] } {
  return "children" in item;
}

/** True when `pathname` is `href` or a page below it (e.g. /gallery/123). */
export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
