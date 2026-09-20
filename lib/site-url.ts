// The public address of the site, used for absolute links (sitemap, canonical URLs,
// share images, WhatsApp alerts). Set NEXT_PUBLIC_SITE_URL in Vercel once the custom
// domain is live, e.g. https://thelaurelsglobalschool.com
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://laurels-global-school.vercel.app").replace(/\/+$/, "");
