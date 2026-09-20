import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { formatEventDate, splitEvents, type SchoolEvent } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events, holidays and activities at The Laurels Global School.",
};

// Statically rendered, refreshed hourly (so "upcoming" stays accurate) and
// immediately whenever the admin edits an event.
export const revalidate = 3600;

function EventList({ events }: { events: SchoolEvent[] }) {
  return (
    <div className="notice-list">
      {events.map((e) => (
        <div className="notice" key={e.id}>
          <span className="date mono">{formatEventDate(e.event_date, e.end_date)}</span>
          <div>
            <h3>{e.title}</h3>
            {e.description && <p>{e.description}</p>}
          </div>
          {e.category ? <span className="tag">{e.category}</span> : <span />}
        </div>
      ))}
    </div>
  );
}

export default async function EventsPage() {
  const { data } = await createPublicClient()
    .from("events")
    .select("id, title, description, event_date, end_date, category")
    .eq("is_published", true);

  const { upcoming, past } = splitEvents(data ?? []);

  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Events
        </div>
        <span className="eyebrow">Events &amp; Calendar</span>
        <h1>What&apos;s Happening at Laurels</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        {upcoming.length > 0 ? (
          <>
            <h2 style={{ fontSize: "1.2rem", marginBottom: ".6rem" }}>Upcoming</h2>
            <EventList events={upcoming} />
          </>
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            <div>
              <h3>No upcoming events</h3>
              <p>Check back soon — the school will post upcoming events, holidays and activities here.</p>
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: ".6rem" }}>Past events</h2>
            <EventList events={past} />
          </div>
        )}
      </section>
    </>
  );
}
