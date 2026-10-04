import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { FLAG_HOME_REDIRECT_ON, FLAG_HOME_REDIRECT_TO, isFlagsOwner } from "@/lib/flags";
import FlagsLogin from "./FlagsLogin";
import FlagsPanel from "./FlagsPanel";

// Hidden owner page: not linked anywhere, not indexed, and only the owner's email gets in.
export const metadata: Metadata = {
  title: "Flags",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function FlagsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isFlagsOwner(user?.email)) return <FlagsLogin />;

  const { data } = await createPublicClient()
    .from("site_flags")
    .select("key, value")
    .in("key", [FLAG_HOME_REDIRECT_ON, FLAG_HOME_REDIRECT_TO]);
  const values = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));

  return (
    <FlagsPanel
      email={user!.email ?? ""}
      homeRedirectOn={values[FLAG_HOME_REDIRECT_ON] === "on"}
      homeRedirectTo={values[FLAG_HOME_REDIRECT_TO] ?? "/"}
    />
  );
}
