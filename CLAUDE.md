@AGENTS.md

# Project status (as of 2026-09-24)

Stack: Next.js 16 (App Router) + Supabase (Postgres/Auth/Storage) on Vercel. Repo `skillbit/laurels-global-school`, live at `laurels-global-school.vercel.app`. `README.md` = setup, admin guide and architecture. `SECURITY.md` = security findings and checklists (source of truth for security work). `SEO.md` = what SEO is done in code and the manual steps for the school.

## Working agreements (from the owner)
- Commit messages: a single line, no Claude/Co-Authored-By attribution. Commit only when asked; **never push** (the owner pushes).
- Keep chat replies short and precise.
- The brand is fixed: the shield logo (`public/logo.jpg`, or the one uploaded in Branding; shown via `components/site/SchoolLogo.tsx`), crimson/gold palette, Fraunces/Public Sans. Change layout and components freely, never the logo or colours. The old SVG wreath mark was retired on 2026-09-24 at the owner's request.
- The owner's admin account (`shreyansh001717@gmail.com`, in `lib/protected-admins.ts`) must never be disabled or deleted; the UI hides those buttons and the server actions refuse.
- Don't stop the owner's dev server: never run `taskkill /IM node.exe`; stop a test server by its PID only.
- Don't enter passwords into login forms; ask the owner to sign in themselves in the browser.
- The local `.env.local` points at the **live** Supabase project. Anything created in a local admin is live data. Tidy up test data (see "Testing" below).

## Built
- All public pages (home, about, academics, admissions, contact, gallery albums, notices, events, documents, achievements, careers, alumni) in design "Direction B" (chosen 2026-09-24): homepage = notice strip, hero with the logo on a ringed arch + 2 random gallery photos, facts bar, academics intro beside 4 stage cards, crimson "why" band, events + notice board, random gallery strip, admissions panel. Inner pages share a full-width crimson `PageHeader` band and card lists. Homepage photos are shuffled in the browser on every visit (`components/site/HomePhotos.tsx`) from the newest 24 (`lib/gallery.ts`).
- One menu source (`components/site/nav-links.ts`): header dropdowns (About, Academics, School life) and the footer columns come from it, so every page is reachable from both. Hamburger menu below 1060px.
- Full admin panel: notices, gallery albums, events, documents, achievements, alumni, history (milestones), staff, enquiries inbox, careers + applications inbox (private resumes), site settings, branding (logo/favicon), admin accounts. Grouped sidebar + dashboard.
- Live Google map on Contact (uses `site_settings.map_embed_url`, otherwise searches school name + address).
- Branded 404 and error pages (public and admin). Mobile checked at 360/390/768px (admin tables become stacked cards).
- Site-settings phone fields accept several numbers separated by commas: use `settings.phones` (all) and `settings.callPhone` (for Call buttons), never the raw `phonePrimary`/`phoneSecondary` for display.
- **WhatsApp alerts** (`lib/whatsapp.ts`, `lib/notify.ts`): a short message to the office when an enquiry or job application is saved. Recipients are set in **Admin → WhatsApp Alerts** (`alert_settings` table, admin-only RLS; `WHATSAPP_TO` env is the fallback), with a test button. Sending needs Meta Cloud API env vars, or CallMeBot keys entered per number on that page (provider auto-detected). Runs in `after()`, never fails the form, pauses if >8 submissions in 10 min.
- Notices can carry an uploaded attachment (browser -> Storage `public/notices/`; old file removed on replace/delete). Documents upload tested OK at 3 MB and 8 MB on 2026-09-24.
- Admin Accounts: Disable and Delete (deletes the auth user; `admin_users` cascades). No self-delete, last active admin kept, owner protected.
- **SEO** (see SEO.md): sitemap incl. albums, robots, canonical URLs, unique metadata, School + Event JSON-LD, branded share image, manifest, noindex admin, `next/image` for Supabase photos. Lighthouse (Edge, mobile): SEO 100, Accessibility 100, Best practices 100, Performance ~90.
- Migrations `0001`-`0004` in `supabase/migrations/` have been run in Supabase.
- End-to-end test done on 2026-09-20 through the real admin and public forms (every section, uploads, resume in private bucket, publish toggle, edit); all worked; test data was removed.
- Security review done 2026-09-20 (see SECURITY.md). Fixed in code: security headers, admin self/last-admin lockout, 12-character admin passwords.
- All work is on `main` (the old `redesign-homepage` branch was deleted).

## Gotchas learned
- **Refreshing public pages:** `revalidatePath("/x", "layout")` does NOT refresh pages inside the `(site)` route group; use the page form `revalidatePath("/x")` (only `revalidatePath("/", "layout")` works, and only for everything). Public pages also re-check every 60 s (`revalidate = 60` in `app/(site)/layout.tsx`).
- Public pages read through `lib/supabase/public.ts` (cookie-less) so they stay static; `/gallery/[id]` and `/notices` are dynamic.
- Next.js 16 `error.tsx` receives `retry`, not `reset`.
- Many source files use CRLF line endings: string-replace scripts must normalise `\r\n` first (or use the Edit tool).
- The admin `ConfirmDeleteButton` uses `confirm()`: in browser automation set `window.confirm = () => true` first, or the dialog blocks the extension.
- Large file uploads go browser -> Supabase Storage; only the path is saved by a Server Action (path validated with a strict regex). Resumes upload through a Server Action (body limit raised to 4 MB in `next.config.ts`).
- Absolute links (sitemap, canonical, share image, alerts) come from `lib/site-url.ts` = `NEXT_PUBLIC_SITE_URL` (defaults to the vercel.app address). Set it to the custom domain when live.
- Photos use `next/image` and must come from the Supabase host allowed in `next.config.ts`. Keep headings in order (no skipped levels), and small-text contrast at 4.5:1 or better.
- Shell tip: long multi-line Python/bash heredocs sometimes fail to parse on this machine; write scripts to a file with the Write tool and run them.

## Testing
- Automated: `npm run lint`, `npm run build`, `npm audit`, `npm run security:probe` (database/storage access with only the public key; currently 1 expected FAIL = SECURITY.md S1). Lighthouse: `CHROME_PATH=<Edge path> npx lighthouse http://localhost:3100/ ...` against `next start`.
- Manual end-to-end with dummy data: create records through the admin/public forms (files can be attached in the browser with a `DataTransfer` file list), verify the public pages, then remove them with a service-role cleanup script that only matches rows created since the test start AND exact titles (dry-run first). Don't leave test data on the live site.

## Still to do
1. **Owner decision pending:** the fee-structure upload works locally (tested); ask where/what failed for the owner if it recurs (live site? file >10 MB?).
2. **Domain (owner will do this last):** link `thelaurelsglobalschool.com`. At GoDaddy: A `@` -> `216.198.79.1`, CNAME `www` -> `cname.vercel-dns.com` (remove default `@`/`www` records first). Then set `NEXT_PUBLIC_SITE_URL` in Vercel and redeploy.
3. **SEO, owner steps (SEO.md section 2):** Google Search Console + submit sitemap, Google Business Profile (most important for local search), Bing, listings, reviews, keep content fresh. Possible code follow-ups: FAQ section on Admissions (+ FAQ schema), "why choose us" text mentioning the location, add the affiliation number.
4. **WhatsApp alerts, owner setup:** add numbers in Admin → WhatsApp Alerts; for CallMeBot add each number's key there, for Meta set the env vars in Vercel (README "WhatsApp alerts"); then press "Send a test message".
5. **Security, open items (details and SQL in SECURITY.md):** S1 public-form abuse (DB size limits + `status = 'new'` policy + CAPTCHA/rate limit) is the top one; S2 two-factor + disable public sign-ups in Supabase; S3 Content-Security-Policy; S4 bucket size/type limits; S5 separate dev and live Supabase projects; S6 roles + audit log; S10 privacy notice on forms; S11 backups.
6. **Content only the school can supply:** real principal/staff (via Staff admin), exact map pin/embed link, email + office hours, social links, logo/favicon, affiliation number (re-add to `components/site/Footer.tsx`), and confirmed subjects/activities/facilities (`app/(site)/academics/page.tsx` still has draft lists marked TODO).
7. **Housekeeping:** delete the dummy admin account (`dummy@gmail.com`) in Admin Accounts when testing is finished.
