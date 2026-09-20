import Link from "next/link";
import { WreathMark } from "@/components/site/WreathDefs";
import { getSiteSettings, telHref } from "@/lib/site-settings";
import { createPublicClient } from "@/lib/supabase/public";
import { formatEventDate, splitEvents } from "@/lib/events";

// Refreshed hourly so the upcoming-events list drops events once they have passed.
export const revalidate = 3600;

const VALUES = [
  {
    title: "Confidence",
    text: "Building self-belief through supported, real learning experiences.",
    icon: <path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2Z" strokeLinejoin="round" />,
  },
  {
    title: "Curiosity",
    text: "Encouraging students to ask questions and explore ideas.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Responsibility",
    text: "Instilling strong values and accountability in everyday choices.",
    icon: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />,
  },
  {
    title: "Technology & Life Skills",
    text: "Practical, future-ready skills alongside academic learning.",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="12" rx="1.5" />
        <path d="M9 21h6M12 17v4" strokeLinecap="round" />
      </>
    ),
  },
];

const STAGES = [
  { grades: "Nursery – UKG", title: "Pre-Primary", text: "Play-based learning that builds early language, motor skills and curiosity." },
  { grades: "Classes 1 – 5", title: "Primary", text: "Foundational literacy, numeracy and inquiry-based learning across core subjects." },
  { grades: "Classes 6 – 8", title: "Middle School", text: "Wider subject exposure with a focus on conceptual clarity and project work." },
  { grades: "Classes 9 – 10", title: "Secondary", text: "CBSE curriculum with focused preparation for board examinations." },
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const { data: eventRows } = await createPublicClient()
    .from("events")
    .select("id, title, description, event_date, end_date, category")
    .eq("is_published", true);
  const upcomingEvents = splitEvents(eventRows ?? []).upcoming.slice(0, 3);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="h-hero wrap">
        <div className="h-hero-grid">
          <div className="h-hero-copy reveal">
            <p className="h-loc">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.4" />
              </svg>
              {settings.address}
            </p>
            <h1 className="display">
              The Laurels
              <em>Global School</em>
            </h1>
            <p className="h-quote">&ldquo;{settings.heroQuote}&rdquo;</p>
            <div className="h-cta-row">
              <Link className="btn btn-primary" href="/admissions#enquiry">
                Admissions Open
              </Link>
              <Link className="btn btn-ghost" href="/contact">
                Visit the Campus
              </Link>
              <a className="h-call" href={telHref(settings.phonePrimary)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.3a16 16 0 0 0 6 6l1.5-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z" />
                </svg>
                Call {settings.phonePrimary}
              </a>
            </div>
          </div>

          <div className="h-arch reveal" aria-hidden="true">
            <div className="h-arch-frame">
              <WreathMark className="h-arch-mark" />
            </div>
            <span className="h-chip h-chip-a">
              <i />
              CBSE curriculum
            </span>
            <span className="h-chip h-chip-b">
              <i />
              Nursery – Class 10
            </span>
            <span className="h-chip h-chip-c">
              <i />
              Dehri-on-Sone, Rohtas
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Facts bar (overlaps the hero) ---------- */}
      <div className="wrap h-facts">
        <dl className="h-facts-card">
          {settings.quickFacts.map((f) => (
            <div className="h-fact" key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---------- Why Laurels ---------- */}
      <section className="wrap">
        <div className="h-why">
          <div className="h-why-head">
            <span className="eyebrow">Why Laurels</span>
            <h2>A School Built Around the Child</h2>
            <p>Four things we teach alongside every subject.</p>
            <Link className="btn btn-ghost" href="/about">
              Our mission &rarr;
            </Link>
          </div>
          <div className="h-values">
            {VALUES.map((v) => (
              <div className="h-value" key={v.title}>
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    {v.icon}
                  </svg>
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Academics: four steps that rise ---------- */}
      <section>
        <div className="wrap">
          <div className="section-tint">
            <div className="h-steps-head">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className="eyebrow">Academics</span>
                <h2>From Nursery to Class 10</h2>
              </div>
              <div className="board-note" style={{ marginTop: 0 }}>
                <span className="pill">CBSE</span>
                <span>Follows the Central Board of Secondary Education framework.</span>
              </div>
            </div>
            <div className="h-steps">
              {STAGES.map((s, i) => (
                <div className="h-step" key={s.title}>
                  <span className="idx" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="grades">{s.grades}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.8rem" }}>
              <Link className="btn btn-ghost" href="/academics">
                More on Academics &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Upcoming events (only when there are some) ---------- */}
      {upcomingEvents.length > 0 && (
        <section className="wrap">
          <div className="section-head">
            <span className="eyebrow">Events</span>
            <h2>Coming Up</h2>
          </div>
          <div className="h-events">
            {upcomingEvents.map((e) => {
              const d = new Date(`${e.event_date}T00:00:00`);
              const multiDay = e.end_date && e.end_date !== e.event_date;
              return (
                <div className="h-ev" key={e.id}>
                  <div className="h-ev-date">
                    <strong>{d.toLocaleDateString("en-IN", { day: "2-digit" })}</strong>
                    <span>{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                  </div>
                  <div>
                    <h3>{e.title}</h3>
                    {(multiDay || e.description) && (
                      <p>
                        {multiDay ? `${formatEventDate(e.event_date, e.end_date)}${e.description ? " — " : ""}` : ""}
                        {e.description}
                      </p>
                    )}
                  </div>
                  {e.category ? <span className="tag">{e.category}</span> : <span />}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "1.4rem" }}>
            <Link className="btn btn-ghost" href="/events">
              All events &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ---------- Admissions ---------- */}
      <section className="wrap">
        <div className="h-cta">
          <div className="h-cta-copy">
            <h2>Admissions are open</h2>
            <p>
              Nursery to Class 10 for the current academic year. Visit the campus, call the office, or send an enquiry and
              we&apos;ll get back to you.
            </p>
            <div className="btns">
              <Link className="btn btn-light" href="/admissions#enquiry">
                Send an enquiry
              </Link>
              <Link className="btn btn-outline-light" href="/admissions">
                How admissions work
              </Link>
            </div>
          </div>
          <div className="h-contact">
            <div>
              <small>Call the office</small>
              <a className="phone" href={telHref(settings.phonePrimary)}>
                {settings.phonePrimary}
              </a>
              <a className="phone" href={telHref(settings.phoneSecondary)}>
                {settings.phoneSecondary}
              </a>
            </div>
            <div>
              <small>Visit us</small>
              <p>{settings.address}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
