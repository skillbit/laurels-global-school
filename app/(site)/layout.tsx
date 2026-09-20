import WreathDefs from "@/components/site/WreathDefs";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import AnnouncementBanner from "@/components/site/AnnouncementBanner";
import { getSiteSettings, telHref } from "@/lib/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <WreathDefs />
      <AnnouncementBanner
        message={settings.bannerMessage}
        link={settings.bannerLink}
        active={settings.bannerActive}
      />
      <Header logoUrl={settings.logoUrl} phoneHref={telHref(settings.phonePrimary)} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
