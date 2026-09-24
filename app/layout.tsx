import type { Metadata } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./ui.css";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";
import { SITE_URL } from "@/lib/site-url";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { faviconUrl } = await getSiteSettings();
  const title = "The Laurels Global School — CBSE School in Dehri-on-Sone, Bihar";
  const description =
    "The Laurels Global School is a CBSE school in Dehri-on-Sone, Rohtas, Bihar for Nursery to Class 10. See admissions, academics, events, photos and contact details.";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s — The Laurels Global School" },
    description,
    applicationName: "The Laurels Global School",
    // "./" makes every page point to its own clean address as the preferred (canonical) URL.
    alternates: { canonical: "./" },
    openGraph: { type: "website", locale: "en_IN", siteName: "The Laurels Global School", title, description },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
    // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the code Google Search Console gives you.
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    // Uploaded from /admin/branding; falls back to the default icon in public/.
    icons: { icon: faviconUrl ?? "/favicon.ico" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${publicSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
