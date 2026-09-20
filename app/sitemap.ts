import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { createPublicClient } from "@/lib/supabase/public";

// Refreshed hourly so new photo albums appear in the sitemap without a redeploy.
export const revalidate = 3600;

const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/admissions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/academics", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/notices", priority: 0.7, changeFrequency: "weekly" },
  { path: "/events", priority: 0.7, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
  { path: "/documents", priority: 0.5, changeFrequency: "monthly" },
  { path: "/achievements", priority: 0.5, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
  { path: "/alumni", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Published photo albums that have at least one photo.
  try {
    const { data } = await createPublicClient()
      .from("gallery_albums")
      .select("id, updated_at, gallery_images(id)")
      .eq("is_published", true);
    for (const a of data ?? []) {
      if (a.gallery_images.length === 0) continue;
      entries.push({
        url: `${SITE_URL}/gallery/${a.id}`,
        lastModified: new Date(a.updated_at),
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
  } catch {
    // If the database is unreachable the static pages are still listed.
  }

  return entries;
}
