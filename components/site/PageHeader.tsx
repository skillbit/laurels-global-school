import Link from "next/link";

// Shared full-width header band for every inner page: breadcrumb, title and an optional intro.
export default function PageHeader({
  crumb,
  trail = [],
  eyebrow,
  title,
  intro,
}: {
  crumb: string;
  trail?: { label: string; href: string }[];
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="ph">
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {trail.map((t) => (
            <span key={t.href}>
              {" / "}
              <Link href={t.href}>{t.label}</Link>
            </span>
          ))}
          {" / "}
          <span aria-current="page">{crumb}</span>
        </nav>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {intro && <p className="ph-intro">{intro}</p>}
      </div>
    </div>
  );
}
