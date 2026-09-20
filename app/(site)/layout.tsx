import WreathDefs from "@/components/site/WreathDefs";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import AnnouncementBanner from "@/components/site/AnnouncementBanner";
import JsonLd from "@/components/site/JsonLd";
import { getSiteSettings, telHref } from "@/lib/site-settings";
import { SITE_URL } from "@/lib/site-url";

// Public pages are pre-built and reused. Admin saves refresh them instantly on the
// deployment where the admin ran, but edits made elsewhere (a local dev admin, the
// Supabase dashboard) share the same database, so also re-check it every minute.
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const toE164 = (p: string) => {
    const digits = p.replace(/\D/g, "");
    return p.trim().startsWith("+") ? `+${digits}` : digits.length === 10 ? `+91${digits}` : `+${digits}`;
  };
  const school = {
    "@context": "https://schema.org",
    "@type": "School",
    name: "The Laurels Global School",
    url: SITE_URL,
    description: "CBSE school for Nursery to Class 10 in Dehri-on-Sone, Rohtas, Bihar.",
    image: `${SITE_URL}/opengraph-image`,
    ...(settings.logoUrl ? { logo: settings.logoUrl } : {}),
    telephone: settings.phones.map(toE164),
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Dehri-on-Sone",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`The Laurels Global School, ${settings.address}`)}`,
    sameAs: [settings.facebookUrl, settings.instagramUrl, settings.youtubeUrl, settings.xUrl].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={school} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <WreathDefs />
      <AnnouncementBanner
        message={settings.bannerMessage}
        link={settings.bannerLink}
        active={settings.bannerActive}
      />
      <Header logoUrl={settings.logoUrl} phoneHref={telHref(settings.callPhone)} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
