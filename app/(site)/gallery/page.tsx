import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Campus and event photos from The Laurels Global School, Dehri-on-Sone.",
};

const ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none"><use href="#leaf-icon" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none"><path d="M4 19V5a1 1 0 0 1 1-1h6v16H5a1 1 0 0 1-1-1Z" stroke="currentColor" strokeWidth="1.6" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none"><path d="M12 2l9 4.5-9 4.5-9-4.5L12 2Z" stroke="currentColor" strokeWidth="1.6" /></svg>,
  <svg key="6" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
  <svg key="7" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>,
  <svg key="8" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
];

export default function GalleryPage() {
  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Gallery
        </div>
        <span className="eyebrow">Gallery &amp; Events</span>
        <h1>Life at Laurels</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <p className="gallery-cap">
          Campus and event photos will appear here once the admin panel&apos;s photo upload is
          connected (see project plan, Phase 4) — the school admin will be able to upload and
          remove photos directly, no code changes needed.
        </p>
        <div className="gallery-grid">
          {ICONS.map((icon, i) => (
            <div className="tile" key={i} aria-hidden="true">
              {icon}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
