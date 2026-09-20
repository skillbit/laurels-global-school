"use client";

import { useEffect } from "react";
import Link from "next/link";

// Shared "something went wrong" panel used by the public and admin error boundaries.
export default function ErrorPanel({
  error,
  retry,
  homeHref,
  homeLabel,
}: {
  error: Error & { digest?: string };
  retry: () => void;
  homeHref: string;
  homeLabel: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap">
      <div className="ph">
        <span className="eyebrow">Something went wrong</span>
        <h1>This page didn&apos;t load properly</h1>
        <p className="ph-intro">It&apos;s on our side. Please try again, or call the school office if it keeps happening.</p>
        <div className="nf-links">
          <button className="btn btn-primary" onClick={() => retry()}>
            Try again
          </button>
          <Link className="btn btn-ghost" href={homeHref}>
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
