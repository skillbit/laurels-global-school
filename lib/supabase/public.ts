import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-less anon client for public, read-only data (e.g. site_settings).
// Unlike lib/supabase/server.ts it doesn't touch cookies(), so pages that use
// it can stay statically rendered and are refreshed via revalidatePath().
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
