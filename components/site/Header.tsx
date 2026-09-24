"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SchoolLogo from "./SchoolLogo";
import { NAV, isActive, isGroup } from "./nav-links";

export default function Header({ logoUrl, phoneHref }: { logoUrl: string | null; phoneHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setOpenGroup(null);
  }

  // Close a dropdown on outside click or Escape.
  useEffect(() => {
    if (!openGroup) return;
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openGroup]);

  return (
    <header className="site">
      <div className="wrap nav-row">
        <Link href="/" className="brand">
          <SchoolLogo src={logoUrl} />
          <span className="brand-text">
            <strong>The Laurels Global School</strong>
            <span>Dehri-on-Sone &middot; CBSE</span>
          </span>
        </Link>
        <nav className="links" aria-label="Primary" ref={navRef}>
          {NAV.map((item) =>
            isGroup(item) ? (
              <div
                key={item.label}
                className={`nav-group${openGroup === item.label ? " open" : ""}`}
                onMouseLeave={() => setOpenGroup((g) => (g === item.label ? null : g))}
              >
                <button
                  type="button"
                  className={`navlink nav-toggle${item.children.some((c) => isActive(pathname, c.href)) ? " active" : ""}`}
                  aria-expanded={openGroup === item.label}
                  onClick={() => setOpenGroup((g) => (g === item.label ? null : item.label))}
                >
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className="nav-menu">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      aria-current={isActive(pathname, c.href) ? "page" : undefined}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`navlink${isActive(pathname, item.href) ? " active" : ""}`}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="navcta">
          <a className="btn btn-ghost sm-hide" href={phoneHref}>
            Call
          </a>
          <Link className="btn btn-primary" href="/admissions#enquiry">
            Apply<span className="sm-hide">&nbsp;now</span>
          </Link>
          <button
            className="menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Menu">
          <div className="wrap">
            {NAV.map((item) =>
              isGroup(item) ? (
                <div key={item.label} className="mobile-group">
                  <p>{item.label}</p>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={`navlink${isActive(pathname, c.href) ? " active" : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navlink${isActive(pathname, item.href) ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <a className="btn btn-ghost" href={phoneHref}>
              Call the office
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
