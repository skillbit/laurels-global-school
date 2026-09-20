@AGENTS.md

# Project status (as of 2026-09-20)

Stack: Next.js 16 (App Router) + Supabase (Postgres/Auth/Storage) on Vercel. Repo `skillbit/laurels-global-school`, live at `laurels-global-school.vercel.app`. `README.md` = setup, admin guide and architecture. `SECURITY.md` = security findings and checklists (source of truth for security work).

## Working agreements (from the owner)
- Commit messages: a single line, no Claude/Co-Authored-By attribution. Commit only when asked; **never push** (the owner pushes).
- Keep chat replies short and precise.
- The brand is fixed: wreath logo, crimson/gold palette, Fraunces/Public Sans. Change layout and components freely, never the logo or colours.
- Don't stop the owner's dev server: never run `taskkill /IM node.exe`; stop a test server by its PID only.
- Don't enter passwords into login forms; ask the owner to sign in themselves in the browser.
- The local `.env.local` points at the **live** Supabase project. Anything created in a local admin is live data. Tidy up test data (see "Testing" below).

## Built
- All public pages (home, about, academics, admissions, contact, gallery albums, notices, events, documents, achievements, careers, alumni), one design system (`PageHeader`, divided panels, deep-crimson footer pinned to the bottom of short pages).
- Full admin panel: notices, gallery albums, events, documents, achievements, alumni, history (milestones), staff, enquiries inbox, careers + applications inbox (private resumes), site settings, branding (logo/favicon), admin accounts. Grouped sidebar + dashboard.
- Live Google map on Contact (uses `site_settings.map_embed_url`, otherwise searches school name + address).
- Branded 404 and error pages (public and admin). Mobile checked at 360/390/768px (admin tables become stacked cards).
- Site-settings phone fields accept several numbers separated by commas: use `settings.phones` (all) and `settings.callPhone` (for Call buttons), never the raw `phonePrimary`/`phoneSecondary` for display.
- Migrations `0001`-`0003` in `supabase/migrations/` have been run in Supabase.
- End-to-end test done on 2026-09-20 through the real admin and public forms (every section, uploads, resume in private bucket, publish toggle, edit); all worked; test data was removed.
- Security review done 2026-09-20 (see SECURITY.md). Fixed in code: security headers, admin self/last-admin lockout, 12-character admin passwords.
- All work is on `main`; the merged `redesign-homepage` branch still exists locally.

## Gotchas learned
- **Refreshing public pages:** `revalidatePath("/x", "layout")` does NOT refresh pages inside the `(site)` route group; use the page form `revalidatePath("/x")` (only `revalidatePath("/", "layout")` works, and only for everything). Public pages also re-check every 60 s (`revalidate = 60` in `app/(site)/layout.tsx`).
- Public pages read through `lib/supabase/public.ts` (cookie-less) so they stay static; `/gallery/[id]` and `/notices` are dynamic.
- Next.js 16 `error.tsx` receives `retry`, not `reset`.
- Large file uploads go browser -> Supabase Storage; only the path is saved by a Server Action (path validated with a strict regex). Resumes upload through a Server Action (body limit raised to 4 MB in `next.config.ts`).
- Shell tip: long multi-line Python/bash heredocs sometimes fail to parse on this machine; write scripts to a file with the Write tool and run them.

## Testing
- Automated: `npm run lint`, `npm run build`, `npm audit`, `npm run security:probe` (database/storage access with only the public key; currently 1 expected FAIL = SECURITY.md S1).
- Manual end-to-end with dummy data: create records through the admin/public forms (files can be attached in the browser with a `DataTransfer` file list), verify the public pages, then remove them with a service-role cleanup script that only matches rows created since the test start AND exact titles (dry-run first). Don't leave test data on the live site.

## Still to do
1. **Domain (owner will do this last):** link `thelaurelsglobalschool.com`. At GoDaddy: A `@` -> `216.198.79.1`, CNAME `www` -> `cname.vercel-dns.com` (remove default `@`/`www` records first).
2. **SEO (next):** `app/sitemap.ts`, `app/robots.ts`, `metadataBase` + canonical URLs, Open Graph/Twitter images, JSON-LD `School` schema, Lighthouse pass; after the domain is live: Google Search Console + Google Business Profile.
3. **Security, open items (details and SQL in SECURITY.md):** S1 public-form abuse (DB size limits + `status = 'new'` policy + CAPTCHA/rate limit) is the top one; S2 two-factor + disable public sign-ups in Supabase; S3 Content-Security-Policy; S4 bucket size/type limits; S5 separate dev and live Supabase projects; S6 roles + audit log; S10 privacy notice on forms; S11 backups.
4. **Content only the school can supply:** real principal/staff (via Staff admin), exact map pin/embed link, email + office hours, social links, logo/favicon, affiliation number (re-add to `components/site/Footer.tsx`), and confirmed subjects/activities/facilities (`app/(site)/academics/page.tsx` still has draft lists marked TODO).
5. **Housekeeping:** delete the dummy admin account (`dummy@gmail.com`) and the owner's "Dummy" gallery album; delete the merged `redesign-homepage` branch.
6. **Nice to have:** email/WhatsApp alert when an enquiry or application arrives (today the admin must check the dashboard).
