import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings, telHref } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit or contact The Laurels Global School, Dehri-on-Sone, Rohtas, Bihar.",
};

export default async function ContactPage() {
  const s = await getSiteSettings();

  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Contact
        </div>
        <span className="eyebrow">Contact</span>
        <h1>Visit or Get in Touch</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.4" />
              </svg>
              <div>
                <strong>Address</strong>
                {s.address}
              </div>
            </div>
            <div className="contact-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.3a16 16 0 0 0 6 6l1.5-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z" />
              </svg>
              <div>
                <strong>Phone</strong>
                <a href={telHref(s.phonePrimary)}>{s.phonePrimary}</a> &middot; <a href={telHref(s.phoneSecondary)}>{s.phoneSecondary}</a>
              </div>
            </div>
            <div className="contact-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              <div>
                <strong>{s.email ? "Email & Office Hours" : "Office Hours"}</strong>
                {s.email && (
                  <>
                    <a href={`mailto:${s.email}`}>{s.email}</a>
                    <br />
                  </>
                )}
                {s.officeHours}
              </div>
            </div>
            <a className="btn btn-primary" href={telHref(s.phonePrimary)} style={{ alignSelf: "flex-start" }}>
              Call Now
            </a>
          </div>
          {s.mapEmbedUrl ? (
            <div className="map-art">
              <iframe
                src={s.mapEmbedUrl}
                title="Map showing the location of The Laurels Global School"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
          <div className="map-art" aria-hidden="true">
            <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
              <rect width="400" height="320" fill="var(--surface-alt)" />
              <path d="M0 60 H400 M0 140 H400 M0 230 H400" stroke="var(--border)" strokeWidth="2" />
              <path d="M60 0 V320 M320 0 V320" stroke="var(--border)" strokeWidth="2" />
              <path d="M0 190 C 120 150, 260 210, 400 170" stroke="var(--gold)" strokeWidth="5" fill="none" strokeLinecap="round" />
              <text x="70" y="184" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="var(--ink-faint)">
                NH2 &middot; Pahleja Road
              </text>
              <g transform="translate(230,150)">
                <path d="M0 -26c11 0 20 9 20 20 0 15-20 34-20 34S-20 9-20-6c0-11 9-20 20-20Z" fill="var(--laurel)" />
                <circle cx="0" cy="-6" r="7" fill="var(--surface)" />
              </g>
              <text x="150" y="230" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="var(--ink-faint)">
                Dehri-on-Sone, Rohtas
              </text>
            </svg>
          </div>
          )}
        </div>
      </section>
    </>
  );
}
