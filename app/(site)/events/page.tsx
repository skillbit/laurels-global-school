import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import JsonLd from "@/components/site/JsonLd";
import { SITE_URL } from "@/lib/site-url";
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

  // Lets Google show upcoming school events in search results.
  const eventsData = {
    "@context": "https://schema.org",
    "@graph": upcoming.map((e) => ({
      "@type": "Event",
      name: e.title,
      ...(e.description ? { description: e.description } : {}),
      startDate: e.event_date,
      endDate: e.end_date ?? e.event_date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: "The Laurels Global School", address: "Dehri-on-Sone, Rohtas, Bihar, India" },
      organizer: { "@type": "Organization", name: "The Laurels Global School", url: SITE_URL },
    })),
  };

  return (
    <>
      {upcoming.length > 0 && <JsonLd data={eventsData} />}
      <PageHeader crumb="Events" eyebrow="Events &amp; Calendar" title="What&apos;s Happening at Laurels" intro="Holidays, exams and school activities in one calendar." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        {upcoming.length > 0 ? (
          <>
            <h2 className="h2-sm">Upcoming</h2>
            <EventList events={upcoming} />
          </>
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            <div>
              <h2>No upcoming events</h2>
              <p>Check back soon — the school will post upcoming events, holidays and activities here.</p>
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <h2 className="h2-sm">Past events</h2>
            <EventList events={past} />
          </div>
        )}
      </section>
    </>
  );
}
