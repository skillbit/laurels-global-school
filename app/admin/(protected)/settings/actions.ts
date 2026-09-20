"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { DEFAULTS, safeMapUrl } from "@/lib/site-settings";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim() || null;
}

function fail(message: string): never {
  redirect(`/admin/settings?error=${encodeURIComponent(message)}`);
}

function httpsUrl(value: string | null, label: string) {
  if (value && !/^https:\/\/\S+$/.test(value)) fail(`${label} must be a full https:// link.`);
  return value;
}

// Accepts either the embed URL or the whole <iframe …> snippet Google gives you.
function readMapUrl(raw: string | null) {
  if (!raw) return null;
  const src = raw.match(/src=["']([^"']+)["']/i)?.[1] ?? raw;
  const safe = safeMapUrl(src);
  if (!safe) {
    fail(
      "Map link must be a Google Maps embed URL (Google Maps → Share → Embed a map → copy the src link, or paste the whole iframe code)."
    );
  }
  return safe;
}

function readQuickFacts(raw: string | null) {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.split("|").map((p) => p.trim()))
    .filter(([label, value]) => label && value)
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();

  const bannerLink = text(formData, "banner_link");
  if (bannerLink && !/^(\/\S*|https?:\/\/\S+)$/.test(bannerLink)) {
    fail("Banner link must start with / (a page on this site) or https://.");
  }
  const email = text(formData, "email");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) fail("Please enter a valid email address.");

  const bannerActive = formData.get("banner_active") === "on";
  const bannerMessage = text(formData, "banner_message");
  if (bannerActive && !bannerMessage) fail("Add a banner message, or turn the banner off.");

  const fields = {
    id: 1,
    // Never store null here: a null banner_message means "settings never saved".
    banner_message: bannerMessage ?? DEFAULTS.bannerMessage,
    banner_link: bannerLink,
    banner_active: bannerActive,
    address: text(formData, "address"),
    phone_primary: text(formData, "phone_primary"),
    phone_secondary: text(formData, "phone_secondary"),
    email,
    office_hours: text(formData, "office_hours"),
    map_embed_url: readMapUrl(text(formData, "map_embed_url")),
    facebook_url: httpsUrl(text(formData, "facebook_url"), "Facebook link"),
    instagram_url: httpsUrl(text(formData, "instagram_url"), "Instagram link"),
    youtube_url: httpsUrl(text(formData, "youtube_url"), "YouTube link"),
    x_url: httpsUrl(text(formData, "x_url"), "X link"),
    hero_quote: text(formData, "hero_quote"),
    mission_statement: text(formData, "mission_statement"),
    quick_facts: readQuickFacts(text(formData, "quick_facts")),
    updated_at: new Date().toISOString(),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert(fields);
  if (error) fail(error.message);

  revalidatePath("/", "layout");
  redirect("/admin/settings?success=saved");
}
