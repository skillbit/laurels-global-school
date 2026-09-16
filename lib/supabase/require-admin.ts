import { redirect } from "next/navigation";
import { createClient } from "./server";

// Shared authorization guard for admin Server Actions — re-checks the
// session server-side (never trust the client), used alongside RLS.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("is_active")
    .eq("id", user.id)
    .maybeSingle();
  if (!adminRow?.is_active) redirect("/admin/login");

  return user;
}
