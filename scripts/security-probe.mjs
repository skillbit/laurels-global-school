// Security probe: what can someone holding ONLY the public anon key do?
// Safe to re-run. It inserts one junk enquiry to test the open insert policy and deletes it again.
//
//   npm run security:probe
//
// Needs .env.local with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const results = [];
const check = (name, ok, detail = "") => results.push({ ok, line: `${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  -> " + detail : ""}` });

// 1. Private tables must not be readable by the public.
for (const table of ["enquiries", "career_applications", "admin_users"]) {
  const { data, error } = await anon.from(table).select("*").limit(5);
  check(`public key cannot read ${table}`, !error && (data?.length ?? 0) === 0, error ? error.message : `${data.length} rows`);
}

// 2. The public must not be able to write content tables.
const samples = {
  notices: { title: "x", body: "x" },
  events: { title: "x", event_date: "2026-01-01" },
  staff: { name: "x", role: "x" },
  gallery_albums: { title: "x" },
  milestones: { year: 2000, title: "x" },
  site_settings: { id: 1, hero_quote: "probe" },
};
for (const [table, payload] of Object.entries(samples)) {
  const { error, data } = await anon.from(table).upsert(payload).select();
  check(`public key cannot write ${table}`, !!error || (data?.length ?? 0) === 0, error ? error.message.slice(0, 70) : "no row changed");
}

// 3. Draft (unpublished) rows must be hidden from the public.
for (const [table, flag] of [["notices", "is_published"], ["events", "is_published"], ["documents", "is_published"], ["gallery_albums", "is_published"], ["staff", "is_published"], ["milestones", "is_published"], ["job_postings", "is_active"]]) {
  const a = await anon.from(table).select("id", { count: "exact", head: true });
  const s = await admin.from(table).select("id", { count: "exact", head: true });
  const hidden = await admin.from(table).select("id", { count: "exact", head: true }).eq(flag, false);
  check(`${table}: public sees only published rows (${a.count} of ${s.count}; ${hidden.count} drafts hidden)`, a.count === s.count - hidden.count);
}

// 4. Storage: private bucket closed, no anonymous uploads.
const priv = await anon.storage.from("private").list("resumes");
check("public key cannot list the private resume bucket", !!priv.error || (priv.data?.length ?? 0) === 0, priv.error ? priv.error.message : `${priv.data.length} files`);
const up = await anon.storage.from("public").upload("probe/x.txt", new Blob(["x"]), { upsert: true });
check("public key cannot upload to the public bucket", !!up.error, up.error ? up.error.message : "UPLOADED");

// 5. KNOWN OPEN ISSUE (see SECURITY.md S1): the enquiry form policy accepts anything sent straight to the API.
const junk = { parent_name: "SECURITY-PROBE", phone: "0", status: "forged-status", message: "x".repeat(20000) };
const ins = await anon.from("enquiries").insert(junk);
check("direct API insert with forged status and a 20,000-character message is rejected", !!ins.error, ins.error ? ins.error.message : "ACCEPTED: validation can be bypassed (S1)");
await admin.from("enquiries").delete().eq("parent_name", "SECURITY-PROBE");

console.log(results.map((r) => r.line).join("\n"));
const failed = results.filter((r) => !r.ok).length;
console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed: compare with the open findings in SECURITY.md.`);
process.exit(0);
