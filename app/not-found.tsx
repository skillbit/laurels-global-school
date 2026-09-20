import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="ph">
        <span className="eyebrow">Error 404</span>
        <h1>We couldn&apos;t find that page</h1>
        <p className="ph-intro">The link may be old or mistyped. Try one of these instead.</p>
        <div className="nf-links">
          <Link className="btn btn-primary" href="/">
            Go to the homepage
          </Link>
          <Link className="btn btn-ghost" href="/admissions">
            Admissions
          </Link>
          <Link className="btn btn-ghost" href="/contact">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
