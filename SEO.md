# SEO

How The Laurels Global School website is set up to be found on Google, what is already done in the code, and what still needs a person (the school) to do. No one can promise a first-place ranking: rankings depend on how many good schools compete, how often the site is updated, reviews, and links from other sites. This setup gives the site the strongest possible technical base and the manual steps below build on it.

- **Last checked:** 2026-09-20
- **Measured with Lighthouse** (mobile settings, slow-4G simulation, production build): **SEO 100 · Accessibility 100 · Best practices 100 · Performance 89–92** on the home, admissions, about, contact, events, gallery and notices pages. Largest content paint is about 3.3 s on the simulated slow phone (Google's "good" line is 2.5 s); on real connections it is faster.

---

## 1. Already done in the code

| What | Why it helps | Where |
| --- | --- | --- |
| Unique **title and description** on every page, with the school name and "Dehri-on-Sone / Bihar / CBSE" | This is the text shown in search results | `app/layout.tsx`, `metadata` in each page |
| **Canonical URL** on every page | Tells Google the one preferred address, so `vercel.app` and the real domain don't compete | `alternates.canonical` in `app/layout.tsx` |
| **`sitemap.xml`** (all pages plus every published photo album, refreshed hourly) | Helps Google find everything | `app/sitemap.ts` |
| **`robots.txt`** (allows the site, blocks `/admin`, points to the sitemap) | Keeps the admin out of search | `app/robots.ts` |
| **`noindex`** on all admin pages | The admin panel never shows in results | `app/admin/layout.tsx` |
| **School structured data** (JSON-LD): name, address, phone numbers, email, social links, map | Lets Google show the school as an organisation with contact details | `app/(site)/layout.tsx` |
| **Event structured data** for upcoming events | Can make events appear in search results | `app/(site)/events/page.tsx` |
| **Share image + Open Graph / Twitter cards** (branded 1200×630 picture) | Nice preview when the link is shared on WhatsApp, Facebook, etc. | `app/opengraph-image.tsx` |
| **Web manifest**, `lang="en-IN"`, theme colour | Correct language/region and a tidy "add to home screen" | `app/manifest.ts`, `app/layout.tsx` |
| **Optimised photos** (resized, modern formats) | Faster pages, which Google rewards; a 43 KB test photo became 4 KB on phones | `next/image`, `next.config.ts` |
| **Accessible, readable pages** (contrast, heading order, descriptive links) | Search engines and screen readers understand the pages | Whole site |
| Fast, mobile-first, HTTPS | Ranking factors | Whole site |

## 2. The school still needs to do (in this order)

1. **Link the domain, then tell the site its address.** After `thelaurelsglobalschool.com` works, set `NEXT_PUBLIC_SITE_URL=https://thelaurelsglobalschool.com` in Vercel → Settings → Environment Variables (Production) and redeploy. This makes the sitemap, canonical links, share image and structured data use the real domain. Pick **one** version (with or without `www`) and let Vercel redirect the other.
2. **Google Search Console** (search.google.com/search-console): add the site, verify ownership, then submit `https://<your domain>/sitemap.xml`. Easiest verification: choose "HTML tag", copy the code, put it in Vercel as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, click Verify. (Or use a DNS TXT record at GoDaddy.) Use "URL inspection → Request indexing" for the home page. Check it weekly at first.
3. **Google Business Profile** (business.google.com): this matters most for people searching "school near me" or "CBSE school in Dehri-on-Sone".
   - Create or claim **The Laurels Global School** (category: *School*, or *CBSE school* if offered).
   - Use **exactly** the same name, address and phone number as the website (Admin → Site Settings).
   - Add the website link, opening hours, at least 10 real photos, and the admissions phone number.
   - Verify it (postcard or phone). Ask happy parents to leave Google reviews and reply to each one.
4. **Bing Webmaster Tools** (bing.com/webmasters): import from Search Console (2 minutes).
5. **Consistent listings:** get the school listed with the same name/address/phone on JustDial, Google Maps and local school directories. Consistency matters more than quantity.
6. **Keep the site alive:** post notices and events regularly, upload album photos after every event, keep the admissions banner current. Fresh, real content helps.
7. **Links from other sites:** link to the website from the school's Facebook/Instagram/YouTube pages, alumni pages, local news and education sites, and any partner organisations.
8. **Check the share preview** after going live: paste the link in WhatsApp, and test it in Facebook's Sharing Debugger.

## 3. Content ideas that bring more parents from search

Use real phrases parents type, naturally and only where true:
- "CBSE school in Dehri-on-Sone", "school in Rohtas, Bihar", "nursery admission in Dehri-on-Sone".
- Add an **FAQ section** to the Admissions page: documents needed, age criteria, fee structure, school timings, transport, how to visit. Structured FAQ data can be added later (ask for it).
- Add a **"Why choose us"** paragraph on the home page mentioning the location and CBSE.
- Give every photo album a descriptive title ("Annual Day 2026 celebrations"), because titles become page titles.
- Put the CBSE affiliation number on the site once known (a strong trust signal).

## 4. How to check it yourself

```bash
# What Google sees (replace with your address)
curl -s https://<domain>/sitemap.xml | head
curl -s https://<domain>/robots.txt
curl -s https://<domain>/ | grep -o '<link rel="canonical"[^>]*>'

# Automated audit (needs Chrome or Edge)
npx lighthouse https://<domain>/ --only-categories=seo,accessibility,performance,best-practices --view
```

- Rich results: paste a page address into Google's **Rich Results Test** (search.google.com/test/rich-results) to see the School and Event data.
- Speed: **PageSpeed Insights** (pagespeed.web.dev). Photos are the most common cause of slow pages; upload photos under about 2 MB where possible (they are resized automatically, but smaller uploads are faster to save).

## 5. Notes for developers

- **New public page:** add `export const metadata = { title, description }` (keep the description under 160 characters and include the location), add the path to `PAGES` in `app/sitemap.ts`, and use `PageHeader` so there is one `h1`.
- **New photo on a public page:** use `next/image` (`fill` inside a `position: relative` box, or `width`/`height`) with a meaningful `alt`. Photos must come from the Supabase host allowed in `next.config.ts`.
- **Headings** must not skip levels (`h1` then `h2` then `h3`). Empty-state boxes use `h2`.
- **Small text colours:** keep contrast at 4.5:1 or better (`--ink-faint` was darkened for this).
- **Structured data** goes through `components/site/JsonLd.tsx`, which escapes `<` so it can't break out of the script tag. It is the only place raw HTML is injected.
- The base address comes from `lib/site-url.ts` (`NEXT_PUBLIC_SITE_URL`).
