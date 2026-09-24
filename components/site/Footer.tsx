import Link from "next/link";
import SchoolLogo from "./SchoolLogo";
import { NAV, isGroup, type NavLink } from "./nav-links";
import { telHref, type SiteSettings } from "@/lib/site-settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: "Facebook", href: settings.facebookUrl },
    { label: "Instagram", href: settings.instagramUrl },
    { label: "YouTube", href: settings.youtubeUrl },
    { label: "X", href: settings.xUrl },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <span className="foot-mark">
            <SchoolLogo src={settings.logoUrl} />
          </span>
          <div>
            <strong style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 650 }}>
              The Laurels Global School
            </strong>
            <p>{settings.address}</p>
          </div>
        </div>

        {NAV.filter(isGroup).map((group) => (
          <div className="foot-col" key={group.label}>
            <p className="foot-h">{group.label}</p>
            {group.children.map((c) => (
              <Link key={c.href} href={c.href}>
                {c.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="foot-col">
          <p className="foot-h">Admissions &amp; contact</p>
          {NAV.filter((i): i is NavLink => !isGroup(i) && i.href !== "/").map((i) => (
            <Link key={i.href} href={i.href}>
              {i.label}
            </Link>
          ))}
          {settings.phones.map((p) => (
            <a key={p} href={telHref(p)}>
              {p}
            </a>
          ))}
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="wrap foot-note">
        <span>&copy; {new Date().getFullYear()} The Laurels Global School. All rights reserved.</span>
        <span>CBSE curriculum, Nursery to Class 10</span>
      </div>
    </footer>
  );
}
