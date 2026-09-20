import Link from "next/link";
import { WreathMark } from "./WreathDefs";
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
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="mark" src={settings.logoUrl} alt="" style={{ objectFit: "contain" }} />
            ) : (
              <WreathMark />
            )}
          </span>
          <div>
            <strong style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 650 }}>
              The Laurels Global School
            </strong>
            <p>{settings.address}</p>
          </div>
        </div>

        <div className="foot-col">
          <p className="foot-h">Explore</p>
          <Link href="/about">About</Link>
          <Link href="/academics">Academics</Link>
          <Link href="/admissions">Admissions</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="foot-col">
          <p className="foot-h">School life</p>
          <Link href="/events">Events</Link>
          <Link href="/notices">Notices</Link>
          <Link href="/achievements">Achievements</Link>
          <Link href="/documents">Documents</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/alumni">Alumni</Link>
        </div>

        <div className="foot-col">
          <p className="foot-h">Contact</p>
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
