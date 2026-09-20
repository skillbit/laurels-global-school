import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { getSiteSettings, telHref } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit or contact The Laurels Global School, Dehri-on-Sone, Rohtas, Bihar.",
};

export default async function ContactPage() {
  const s = await getSiteSettings();

  // Live, interactive Google map. Uses the admin's embed link when set, otherwise
  // searches for the school by name and address (no API key needed).
  const place = `The Laurels Global School, ${s.address}`;
  const mapSrc = s.mapEmbedUrl ?? `https://www.google.com/maps?q=${encodeURIComponent(place)}&z=16&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;

  return (
    <>
      <PageHeader crumb="Contact" eyebrow="Contact" title="Visit or Get in Touch" intro="Call, visit, or send us a message. We would love to meet you." />

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
          <div className="map-frame">
            <iframe
              src={mapSrc}
              title="Map showing the location of The Laurels Global School"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="map-actions">
              <span>{s.address}</span>
              <div className="row">
                <a className="btn btn-ghost btn-row" href={mapsLink} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
                <a className="btn btn-primary btn-row" href={directionsLink} target="_blank" rel="noopener noreferrer">
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
