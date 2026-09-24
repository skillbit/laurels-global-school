import Link from "next/link";
import SchoolLogo from "@/components/site/SchoolLogo";
import { PhotoSlots, PhotoReel } from "@/components/site/RandomPhotos";
import { getSiteSettings, telHref } from "@/lib/site-settings";
import { createPublicClient } from "@/lib/supabase/public";
import { formatEventDate, splitEvents } from "@/lib/events";
import { getRandomPhotos } from "@/lib/gallery";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  {
    grades: "Nursery – UKG",
    title: "Pre-Primary",
    text: "Play-based learning that builds early language, motor skills and curiosity.",
    icon: (
      <>
        <rect x="3" y="12" width="8" height="8" rx="1" />
        <rect x="13" y="12" width="8" height="8" rx="1" />
        <rect x="8" y="4" width="8" height="8" rx="1" />
      </>
    ),
  },
  {
    grades: "Classes 1 – 5",
    title: "Primary",
    text: "Foundational literacy, numeracy and inquiry-based learning across core subjects.",
    icon: <path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5Zm0 0v13" strokeLinejoin="round" />,
  },
  {
    grades: "Classes 6 – 8",
    title: "Middle School",
    text: "Wider subject exposure with a focus on conceptual clarity and project work.",
    icon: <path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 14h9" strokeLinejoin="round" />,
  },
  {
    grades: "Classes 9 – 10",
    title: "Secondary",
    text: "CBSE curriculum with focused preparation for board examinations.",
    icon: (
      <>
        <path d="M12 4 2 9l10 5 10-5-10-5Z" strokeLinejoin="round" />
        <path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6" strokeLinecap="round" />
      </>
    ),
  },
];

const shortDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

export default async function HomePage() {
  const settings = await getSiteSettings();
  const client = createPublicClient();
  const [{ data: eventRows }, { data: notices }, photos] = await Promise.all([
    client.from("events").select("id, title, description, event_date, end_date, category").eq("is_published", true),
    client
      .from("notices")
      .select("id, title, notice_date, attachment_url")
      .eq("is_published", true)
      .order("notice_date", { ascending: false })
      .limit(4),
    // Every album's photos; shuffled in the browser on each visit.
    getRandomPhotos(),
  ]);
  const upcomingEvents = splitEvents(eventRows ?? []).upcoming.slice(0, 3);
  const latestNotices = notices ?? [];

  return (
    <>
      {/* ---------- Notice strip ---------- */}
      {latestNotices.length > 0 && (
        <div className="b-ticker">
          <div className="wrap b-ticker-row">
            <span className="b-ticker-tag">Notices</span>
            <ul>
              {latestNotices.slice(0, 3).map((n) => (
                <li key={n.id}>
                  <Link href="/notices">
                    <b>{shortDate(n.notice_date)}</b> {n.title}
                    {n.attachment_url ? " (attachment)" : ""}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="b-ticker-all" href="/notices">
              All notices &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* ---------- Hero: copy + photo collage ---------- */}
      <section className="b-hero wrap">
        <div className="b-hero-copy reveal">
          <p className="h-loc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.4" />
            </svg>
            {settings.address}
          </p>
          <h1 className="display">
            The Laurels <em>Global School</em>
          </h1>
          <p className="b-lead">{settings.heroQuote}</p>
          <div className="h-cta-row">
            <Link className={buttonVariants({ size: "lg" })} href="/admissions#enquiry">
              Admissions Open
            </Link>
            <Link className={buttonVariants({ variant: "outline", size: "lg" })} href="/contact">
              Visit the Campus
            </Link>
          </div>
          <a className="h-call" href={telHref(settings.callPhone)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.3a16 16 0 0 0 6 6l1.5-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z" />
            </svg>
            Call the office: {settings.callPhone}
          </a>
        </div>

        <div className="b-collage reveal">
          <div className="b-collage-main b-collage-logo">
            <SchoolLogo src={settings.logoUrl} className="b-logo" alt="The Laurels Global School logo" />
          </div>
          <PhotoSlots photos={photos} count={2} className="b-collage-sm" sizes="(max-width: 860px) 40vw, 240px" priority />
          <div className="b-badge">
            <span className="b-badge-dot" aria-hidden="true" />
            <span>
              <strong>Admissions open</strong>
              <small>Nursery to Class 10 &middot; CBSE</small>
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Facts bar ---------- */}
      <div className="wrap">
        <dl className="h-facts-card">
          {settings.quickFacts.map((f) => (
            <div className="h-fact" key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---------- Gallery strip ---------- */}
      {photos.length >= 5 && (
        <section className="wrap">
          <div className="b-section-head">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Gallery</span>
              <h2>Life at Laurels</h2>
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/gallery">
              See all albums &rarr;
            </Link>
          </div>
          <PhotoReel photos={photos} />
        </section>
      )}

      {/* ---------- Stages: intro beside a 2 x 2 grid ---------- */}
      <section className="wrap">
        <div className="b-academics">
          <div className="b-academics-head">
            <span className="eyebrow">Academics</span>
            <h2>A Path from Nursery to Class 10</h2>
            <p>
              Four stages, one CBSE curriculum. Each stage builds on the last, from learning through play to focused
              preparation for the Class 10 board examinations.
            </p>
            <div className="board-note" style={{ marginTop: 0 }}>
              <span className="pill">CBSE</span>
              <span>Central Board of Secondary Education framework</span>
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/academics">
              Curriculum &amp; facilities &rarr;
            </Link>
          </div>
          <div className="b-stages">
            {STAGES.map((s) => (
              <Link className="b-stage" href="/academics" key={s.title}>
                <span className="b-stage-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {s.icon}
                  </svg>
                </span>
                <small>{s.grades}</small>
                <h3>{s.title}</h3>
                <span>{s.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Why Laurels (full-width crimson band) ---------- */}
      <section className="b-why">
        <div className="wrap b-why-grid">
          <div className="b-why-head">
            <span className="eyebrow">Why Laurels</span>
            <h2>A School Built Around the Child</h2>
            <p>Four things we teach alongside every subject.</p>
            <Link className={buttonVariants({ variant: "light" })} href="/about">
              About the school &rarr;
            </Link>
          </div>
          <div className="b-why-cards">
            {VALUES.map((v) => (
              <div className="b-why-card" key={v.title}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  {v.icon}
                </svg>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Events + notice board ---------- */}
      <section className="wrap">
        <div className="b-news">
          <div>
            <div className="b-section-head">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className="eyebrow">Events</span>
                <h2>Coming Up</h2>
              </div>
              <Link className={buttonVariants({ variant: "outline" })} href="/events">
                All events &rarr;
              </Link>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="h-events">
                {upcomingEvents.map((e) => {
                  const multiDay = e.end_date && e.end_date !== e.event_date;
                  const [day, month] = shortDate(e.event_date).split(" ");
                  return (
                    <div className="h-ev" key={e.id}>
                      <div className="h-ev-date">
                        <strong>{day}</strong>
                        <span>{month}</span>
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
                      {e.category ? <Badge variant="tag" className="ev-tag">{e.category}</Badge> : <span />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="b-empty">No upcoming events right now. Holidays, exams and activities will appear here.</p>
            )}
          </div>

          <aside className="b-board" aria-labelledby="board-title">
            <span className="eyebrow">Notice board</span>
            <h2 id="board-title" className="h2-sm">
              Latest from the office
            </h2>
            {latestNotices.length > 0 ? (
              <ul>
                {latestNotices.map((n) => (
                  <li key={n.id}>
                    <span className="mono">{shortDate(n.notice_date)}</span>
                    {n.attachment_url ? (
                      <a href={n.attachment_url} target="_blank" rel="noopener noreferrer">
                        {n.title}
                        <span className="b-file">Open file</span>
                      </a>
                    ) : (
                      <Link href="/notices">{n.title}</Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="b-empty">No notices yet.</p>
            )}
            <div className="b-board-links">
              <Link href="/notices">All notices &rarr;</Link>
              <Link href="/documents">Fees &amp; documents &rarr;</Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Admissions ---------- */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="h-cta">
          <div className="h-cta-copy">
            <h2>Admissions are open</h2>
            <p>
              Nursery to Class 10 for the current academic year. Visit the campus, call the office, or send an enquiry and
              we&apos;ll get back to you.
            </p>
            <div className="btns">
              <Link className={buttonVariants({ variant: "light" })} href="/admissions#enquiry">
                Send an enquiry
              </Link>
              <Link className={buttonVariants({ variant: "outline-light" })} href="/admissions">
                How admissions work
              </Link>
            </div>
          </div>
          <div className="h-contact">
            <div>
              <small>Call the office</small>
              {settings.phones.map((p) => (
                <a className="phone" key={p} href={telHref(p)}>
                  {p}
                </a>
              ))}
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
