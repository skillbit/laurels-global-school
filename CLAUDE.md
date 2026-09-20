@AGENTS.md

# Project status (as of 2026-09-20)

Stack: Next.js (App Router) + Supabase (Postgres/Auth/Storage) on Vercel. Repo `skillbit/laurels-global-school`, live at `laurels-global-school.vercel.app`.

## Built
- All public pages (home, about, academics, admissions, contact, gallery albums, notices, events, documents, achievements, careers, alumni), redesigned in one style (`PageHeader`, divided panels, deep-crimson footer). Brand (wreath logo, crimson/gold palette, Fraunces/Public Sans) is fixed: do not change it.
- Full admin panel: notices, gallery albums, events, documents, achievements, alumni, staff, enquiries inbox, careers + applications inbox (private resumes), site settings, branding (logo/favicon), admin accounts. Grouped sidebar + dashboard.
- Live Google map on Contact (uses `site_settings.map_embed_url` or searches school name + address).
- Branded 404 and error pages (public and admin).
- Gallery albums need `supabase/migrations/0002_gallery_albums.sql` run once in the Supabase SQL editor.

## Still to do
1. **Push** local commits, then confirm the Vercel deploy works.
2. **Domain:** link `thelaurelsglobalschool.com`. At GoDaddy: A `@` -> `216.198.79.1`, CNAME `www` -> `cname.vercel-dns.com` (remove default `@`/`www` records first).
3. **SEO:** `app/sitemap.ts`, `app/robots.ts`, `metadataBase` + canonical URLs, Open Graph/Twitter images, JSON-LD `School` schema, Lighthouse pass; after the domain is live: Google Search Console + Google Business Profile.
4. ~~Mobile audit~~ DONE (2026-09-20): all pages checked at 360/390/768px (no horizontal overflow; admin tables become stacked cards on phones; footer, header, admin top bar and menu tap targets fixed).
5. **End-to-end test against live Supabase:** enquiry form, career application with resume, staff/gallery/document/branding uploads.
6. **About page "History & Milestones"** is a placeholder with no admin section behind it (needs a small admin CRUD or removal).
7. **Content only the school can supply:** real principal/staff (via Staff admin), exact map pin/embed link, email + office hours, social links, logo/favicon, affiliation number (re-add to `components/site/Footer.tsx`), and confirmed subjects/activities/facilities (`app/(site)/academics/page.tsx` still has draft lists marked TODO).
8. **Housekeeping:** delete the dummy admin account, replace the boilerplate `README.md`, delete the merged `redesign-homepage` branch.
9. **Nice to have:** email/WhatsApp alert when an enquiry or application arrives (today the admin must check the dashboard); rate limiting on public forms beyond the honeypot.
