@AGENTS.md

# Pending items (as of 2026-09-20)

Suggested order (functional first): Site settings → Staff → Events → Documents → Achievements → Careers → Alumni → Branding → dashboard cards; then mobile, domain, SEO. Older list:

mobile responsiveness → enquiry form → Site settings → Staff → rest of Phase 4 → domain → SEO.

## 1. Mobile responsiveness
- `app/globals.css` has only 6 media queries; audit at ~360, 390 and 768px.
- Check header/nav (hamburger), grids, forms, gallery, admin panel + sidebar, tap-target sizes.

## 2. SEO (rank in Google for local searches)
- Add `app/sitemap.ts` and `app/robots.ts`.
- Add `metadataBase`, canonical URLs, per-page descriptions.
- Add Open Graph / Twitter images.
- Add JSON-LD `School` schema (address, phone, hours).
- Alt text on images; run Lighthouse / Core Web Vitals.
- After domain is linked: submit to Google Search Console; create and verify a Google Business Profile.

## 3. Phase 4 — extended admin (not started)
- Admin CRUD missing for: Staff, Events, Documents, Achievements, Careers, Alumni, Site settings (banner, homepage text, contact/map), Branding. Tables already exist in `supabase/migrations/0001_init.sql`.
- Every admin-editable field needs an entry point on the `/admin` dashboard (currently 3 cards; intro text still says "more sections will appear").

## 4. Hardcoded / placeholder content on the public site
- `components/site/AnnouncementBanner.tsx`: static text; drive from `site_settings`.
- Contact page: SVG illustration instead of a real map; use `site_settings.map_embed_url` once address/coordinates are confirmed.
- About page: "Leadership profiles coming soon"; needs real principal/staff details (Staff CRUD).
- `app/(site)/academics/page.tsx`: 2 TODOs (confirm subject list per stage; confirm activities/clubs).
- `components/site/Footer.tsx`: "Affiliation No. — TODO".

## 3b. Site settings — DONE (2026-09-20)
- `/admin/settings` (sidebar + dashboard card) edits banner, contact info, map embed, socials, hero quote, mission statement, quick facts. Public pages read via `lib/site-settings.ts` (falls back to previous hardcoded text; pages stay static, `revalidatePath("/", "layout")` on save). Branding (logo/favicon) still not built. Map/address/email values still need real data entered by the admin.

## 3c. Staff admin — DONE (2026-09-20)
- `/admin/staff` CRUD (list/new/edit, photo upload from browser to `public/staff/`, publish toggle, leadership/faculty groups, display order). About page "Meet the Team" reads published staff; falls back to "coming soon" when empty. Real principal/staff details still need to be entered by the admin.

## 5. Enquiry form — DONE (2026-09-20)
- Wired to `enquiries` via `app/(site)/admissions/actions.ts`; admin inbox at `/admin/enquiries` (+ sidebar and dashboard card). Not yet tested end-to-end against live Supabase.

## 6. Deploy / domain
- `thelaurelsglobalschool.com` not linked. At GoDaddy: A `@` → `216.198.79.1`, CNAME `www` → `cname.vercel-dns.com` (remove default `@`/`www` records first).
- `README.md` is still create-next-app boilerplate.
