@AGENTS.md

# Project status (as of 2026-09-20)

Stack: Next.js (App Router) + Supabase (Postgres/Auth/Storage) on Vercel. Repo `skillbit/laurels-global-school`, live at `laurels-global-school.vercel.app`. See `README.md` for setup and code layout.

## Working agreements (from the owner)
- Commit messages: a single line, no Claude/Co-Authored-By attribution. Commit only when asked; **never push** (the owner pushes).
- Keep chat replies short and precise.
- The brand is fixed: wreath logo, crimson/gold palette, Fraunces/Public Sans. Change layout and components freely, never the logo or colours.
- Don't stop the owner's dev server: never run `taskkill /IM node.exe`; stop a test server by its PID only.
- Don't enter passwords into login forms; ask the owner to sign in themselves in the browser.

## Built
- All public pages (home, about, academics, admissions, contact, gallery albums, notices, events, documents, achievements, careers, alumni), redesigned in one style (`PageHeader`, divided panels, deep-crimson footer).
- Full admin panel: notices, gallery albums, events, documents, achievements, alumni, staff, enquiries inbox, careers + applications inbox (private resumes), site settings, branding (logo/favicon), admin accounts. Grouped sidebar + dashboard.
- Live Google map on Contact (uses `site_settings.map_embed_url` or searches school name + address).
- Branded 404 and error pages (public and admin).
- Mobile pass done: pages checked at 360/390/768px; admin tables become stacked cards on phones.
- Gallery albums (`0002_gallery_albums.sql`, already run) and the About-page history timeline (`0003_milestones.sql`, **run once in the Supabase SQL editor before it works**) have their own migrations. History is managed at `/admin/milestones`; the About section hides itself until there is at least one milestone.
- All work is on `main`; the merged `redesign-homepage` branch still exists locally.

## Still to do
1. **Domain (owner will do this last):** link `thelaurelsglobalschool.com`. At GoDaddy: A `@` -> `216.198.79.1`, CNAME `www` -> `cname.vercel-dns.com` (remove default `@`/`www` records first).
2. **SEO (next):** `app/sitemap.ts`, `app/robots.ts`, `metadataBase` + canonical URLs, Open Graph/Twitter images, JSON-LD `School` schema, Lighthouse pass; after the domain is live: Google Search Console + Google Business Profile.
3. **End-to-end test against live Supabase:** enquiry form, career application with resume, staff/gallery/document/branding uploads.
4. **Content only the school can supply:** real principal/staff (via Staff admin), exact map pin/embed link, email + office hours, social links, logo/favicon, affiliation number (re-add to `components/site/Footer.tsx`), and confirmed subjects/activities/facilities (`app/(site)/academics/page.tsx` still has draft lists marked TODO).
5. **Housekeeping:** delete the dummy admin account (`dummy@gmail.com`) in Admin Accounts; delete the merged `redesign-homepage` branch.
6. **Nice to have:** email/WhatsApp alert when an enquiry or application arrives (today the admin must check the dashboard); rate limiting on public forms beyond the honeypot.
