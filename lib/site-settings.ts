import { createPublicClient } from "@/lib/supabase/public";

export type QuickFact = { label: string; value: string };

export type SiteSettings = {
  bannerMessage: string;
  bannerLink: string;
  bannerActive: boolean;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string | null;
  officeHours: string;
  mapEmbedUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  xUrl: string | null;
  heroQuote: string;
  missionStatement: string;
  quickFacts: QuickFact[];
  logoUrl: string | null;
  faviconUrl: string | null;
};

// Fallbacks so the public site looks the same until the admin fills a field in.
export const DEFAULTS = {
  bannerMessage: "Admissions are open for the current academic year — Nursery to Class 10.",
  bannerLink: "/admissions",
  address: "Near Jln College, NH2, Pahleja Road, Dehri-on-Sone, Rohtas, Bihar",
  phonePrimary: "+91 97710 20700",
  phoneSecondary: "+91 77640 69741",
  officeHours: "For enquiries and admissions, call the school office directly.",
  heroQuote:
    "Nurturing confident, curious, and responsible individuals through quality education, strong values, and meaningful learning experiences.",
  missionStatement:
    "Our mission is to nurture confident, curious, and responsible individuals through quality education, strong values, and meaningful learning experiences. We aim to develop not only academic excellence but also communication, creativity, critical thinking, leadership, technology, and life skills—preparing every student to succeed in a changing world and contribute positively to society.",
  quickFacts: [
    { label: "Board", value: "CBSE" },
    { label: "Grades offered", value: "Nursery – X" },
    { label: "Academic year", value: "Apr – Mar" },
    { label: "Location", value: "Dehri-on-Sone" },
  ] as QuickFact[],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const client = createPublicClient();
  const { data } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const publicUrl = (path: string | null | undefined) =>
    path ? client.storage.from("public").getPublicUrl(path).data.publicUrl : null;

  const facts = Array.isArray(data?.quick_facts)
    ? (data.quick_facts as QuickFact[]).filter((f) => f?.label && f?.value)
    : [];

  return {
    // banner_message stays null until the admin first saves settings; keep the
    // original banner visible until then, afterwards honour the on/off toggle.
    bannerMessage: data?.banner_message || DEFAULTS.bannerMessage,
    bannerLink: data?.banner_link || DEFAULTS.bannerLink,
    bannerActive: data?.banner_message ? Boolean(data.banner_active) : true,
    address: data?.address || DEFAULTS.address,
    phonePrimary: data?.phone_primary || DEFAULTS.phonePrimary,
    phoneSecondary: data?.phone_secondary || DEFAULTS.phoneSecondary,
    email: data?.email || null,
    officeHours: data?.office_hours || DEFAULTS.officeHours,
    mapEmbedUrl: safeMapUrl(data?.map_embed_url),
    facebookUrl: data?.facebook_url || null,
    instagramUrl: data?.instagram_url || null,
    youtubeUrl: data?.youtube_url || null,
    xUrl: data?.x_url || null,
    heroQuote: data?.hero_quote || DEFAULTS.heroQuote,
    missionStatement: data?.mission_statement || DEFAULTS.missionStatement,
    quickFacts: facts.length > 0 ? facts : DEFAULTS.quickFacts,
    logoUrl: publicUrl(data?.logo_path),
    faviconUrl: publicUrl(data?.favicon_path),
  };
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

// Only allow embeds from Google Maps / OpenStreetMap — this value ends up in an <iframe src>.
export function safeMapUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    const googleEmbed =
      (u.hostname === "www.google.com" || u.hostname === "maps.google.com") && u.pathname.startsWith("/maps/embed");
    const osmEmbed = u.hostname === "www.openstreetmap.org" && u.pathname.startsWith("/export/embed");
    return googleEmbed || osmEmbed ? u.toString() : null;
  } catch {
    return null;
  }
}
