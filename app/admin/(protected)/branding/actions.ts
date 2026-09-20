"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type BrandingInput = {
  logo_path: string | null;
  favicon_path: string | null;
};

// Files are uploaded from the browser; only accept paths inside branding/.
const BRANDING_PATH = /^branding\/(logo|favicon)-[\w-]+\.\w+$/;

export async function saveBranding(input: BrandingInput): Promise<{ error?: string }> {
  await requireAdmin();

  if (input.logo_path !== null && !BRANDING_PATH.test(input.logo_path)) return { error: "Invalid logo." };
  if (input.favicon_path !== null && !BRANDING_PATH.test(input.favicon_path)) return { error: "Invalid favicon." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("logo_path, favicon_path")
    .eq("id", 1)
    .maybeSingle();

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    logo_path: input.logo_path,
    favicon_path: input.favicon_path,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };

  // Clean up files that were replaced or removed.
  const stale = [
    existing?.logo_path && existing.logo_path !== input.logo_path ? existing.logo_path : null,
    existing?.favicon_path && existing.favicon_path !== input.favicon_path ? existing.favicon_path : null,
  ].filter((p): p is string => Boolean(p));
  if (stale.length > 0) await supabase.storage.from("public").remove(stale);

  revalidatePath("/", "layout");
  return {};
}
