"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WreathMark } from "./WreathDefs";
import { NAV_LINKS } from "./nav-links";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site">
      <div className="wrap nav-row">
        <Link href="/" className="brand">
          <WreathMark />
          <span className="brand-text">
            <strong>The Laurels Global School</strong>
            <span>Dehri-on-Sone &middot; CBSE</span>
          </span>
        </Link>
        <nav className="links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navlink${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="navcta">
          <a className="btn btn-primary" href="tel:+919771020700">
            Call the Office
          </a>
          <button
            className="menu-btn"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "1rem 0" }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navlink${pathname === link.href ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
