import type { Metadata } from "next";
import Link from "next/link";
import PageImageSlot from "@/components/admin/PageImageSlot";
import { PAGE_IMAGE_SLOTS, getPageImages, type PageKey } from "@/lib/page-images";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page Images" };

export default async function AdminPageImagesPage() {
  const pages = await Promise.all(
    (Object.keys(PAGE_IMAGE_SLOTS) as PageKey[]).map(async (key) => ({
      key,
      config: PAGE_IMAGE_SLOTS[key],
      urls: await getPageImages(key),
    }))
  );

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Page Images</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "62ch", marginBottom: "1.6rem" }}>
        Photos for fixed spots on the website. Until a photo is uploaded, the site shows a neat placeholder. Landscape
        photos (wider than tall) work best; JPG, PNG or WebP up to 10 MB.
      </p>

      {pages.map(({ key, config, urls }) => (
        <section key={key} className="pi-page" aria-labelledby={`pi-${key}`}>
          <div className="pi-page-head">
            <h2 id={`pi-${key}`} className="h2-sm">
              {config.title}
            </h2>
            <Link className={buttonVariants({ variant: "soft", size: "sm" })} href={config.path} target="_blank">
              View page &rarr;
            </Link>
          </div>
          <div className="pi-grid">
            {config.slots.map((s) => (
              <PageImageSlot key={s.key} page={key} slot={s.key} label={s.label} hint={s.hint} url={urls[s.key] ?? null} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
