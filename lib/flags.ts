import "server-only";
import { createPublicClient } from "@/lib/supabase/public";

// Keys in the site_flags table (see supabase/migrations/0006_site_flags.sql).
export const FLAG_HOME_REDIRECT_ON = "home_redirect_on";
export const FLAG_HOME_REDIRECT_TO = "home_redirect_to";

// Same-site paths only, so the flag can't send visitors to another website.
// "/" is refused so the homepage can't redirect to itself.
export function isValidRedirectPath(path: string) {
  return (
    path.length > 0 &&
    path.length <= 200 &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.startsWith("/\\") &&
    path !== "/" &&
    !/\s/.test(path)
  );
}

// Returns the path to send the homepage to, or null when the switch is off
// (or the table is missing / unreadable, which keeps the homepage normal).
export async function getHomeRedirect(): Promise<string | null> {
  const { data } = await createPublicClient()
    .from("site_flags")
    .select("key, value")
    .in("key", [FLAG_HOME_REDIRECT_ON, FLAG_HOME_REDIRECT_TO]);
  const values = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
  if (values[FLAG_HOME_REDIRECT_ON] !== "on") return null;
  const target = (values[FLAG_HOME_REDIRECT_TO] ?? "").trim();
  return isValidRedirectPath(target) ? target : null;
}

// Only the owner's email (env var FLAGS_OWNER_EMAIL) may use /flags.
export function isFlagsOwner(email: string | null | undefined) {
  const owner = process.env.FLAGS_OWNER_EMAIL?.trim().toLowerCase();
  return Boolean(owner) && Boolean(email) && email!.trim().toLowerCase() === owner;
}
