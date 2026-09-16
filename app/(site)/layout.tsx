import WreathDefs from "@/components/site/WreathDefs";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import AnnouncementBanner from "@/components/site/AnnouncementBanner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <WreathDefs />
      <AnnouncementBanner />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
