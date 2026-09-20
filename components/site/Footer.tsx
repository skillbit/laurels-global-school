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
      <div className="wrap foot-row">
        <div className="foot-brand">
          <WreathMark />
          <div>
            <strong style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 650 }}>
              The Laurels Global School
            </strong>
            <p>{settings.address}</p>
          </div>
        </div>
        <div className="foot-links">
          <div className="foot-col">
            <h4>Explore</h4>
            <Link href="/about">About</Link>
            <Link href="/academics">Academics</Link>
            <Link href="/admissions">Admissions</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/events">Events</Link>
            <Link href="/notices">Notices</Link>
            <Link href="/documents">Documents</Link>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <a href={telHref(settings.phonePrimary)}>{settings.phonePrimary}</a>
            <a href={telHref(settings.phoneSecondary)}>{settings.phoneSecondary}</a>
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            <span>CBSE &middot; Nursery&ndash;X</span>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap foot-note">
        <span>&copy; {new Date().getFullYear()} The Laurels Global School. All rights reserved.</span>
        <span>Affiliation No. — TODO</span>
      </div>
    </footer>
  );
}
