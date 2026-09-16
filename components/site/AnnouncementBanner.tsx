"use client";

import { useState } from "react";

type Props = {
  message?: string;
  link?: string;
  active?: boolean;
};

// Placeholder content for now — Phase 4 wires this to the site_settings table
// so the admin can edit/toggle it from /admin/settings.
export default function AnnouncementBanner({
  message = "Admissions are open for the current academic year — Nursery to Class 10.",
  link = "/admissions",
  active = true,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (!active || dismissed) return null;

  return (
    <div className="announce-banner">
      {message} <a href={link}>Learn more</a>
      <button className="close-btn" aria-label="Dismiss announcement" onClick={() => setDismissed(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
