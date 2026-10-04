"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  FLAG_HOME_REDIRECT_ON,
  FLAG_HOME_REDIRECT_TO,
  isFlagsOwner,
  isValidRedirectPath,
} from "@/lib/flags";

export type FlagsState = { ok?: boolean; error?: string } | null;

// Re-checks the signed-in user on the server (never trust the form).
export async function saveHomeRedirect(_prev: FlagsState, formData: FormData): Promise<FlagsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isFlagsOwner(user?.email)) return { error: "Not allowed." };

  const on = formData.get("enabled") === "on";
  const target = String(formData.get("target") ?? "").trim();
  const validTarget = isValidRedirectPath(target);
  if (on && !validTarget) {
    return { error: "Enter a path on this site, starting with / (for example /gallery). The homepage itself can't be used." };
  }

  // Switching off doesn't need a path: the last valid path is kept.
  const now = new Date().toISOString();
  const rows = [{ key: FLAG_HOME_REDIRECT_ON, value: on ? "on" : "off", updated_at: now }];
  if (validTarget) rows.push({ key: FLAG_HOME_REDIRECT_TO, value: target, updated_at: now });
  const { error } = await createAdminClient().from("site_flags").upsert(rows);
  if (error) return { error: "Could not save. Please try again." };

  // Refresh the (cached) homepage so the switch takes effect right away.
  revalidatePath("/");
  return { ok: true };
}
