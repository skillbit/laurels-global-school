import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import MonthCalendar from "@/components/site/MonthCalendar";
import { createPublicClient } from "@/lib/supabase/public";
import { formatEventDate, todayInIndia, type SchoolEvent } from "@/lib/events";
import { fileExtension } from "@/lib/documents";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Academic Calendar",
  description: "Academic and monthly calendar of The Laurels Global School, Dehri-on-Sone: holidays, examinations, parent meetings and school events.",
};

export default async function CalendarPage() {
  const client = createPublicClient();
  // The calendar is built from Admin -> Events & Calendar; the printable copy is a
  // document in the "Academic calendar" category.
  const [{ data: eventRows }, { data: files }] = await Promise.all([
    client.from("events").select("id, title, description, event_date, end_date, category").eq("is_published", true),
    client
      .from("documents")
      .select("id, title, file_path")
      .eq("is_published", true)
      .eq("category", "academic_calendar")
      .order("published_date", { ascending: false }),
  ]);
  const events = (eventRows ?? []) as SchoolEvent[];
  const today = todayInIndia();

  // The school year runs April to March.
  const startYear = Number(today.slice(5, 7)) >= 4 ? Number(today.slice(0, 4)) : Number(today.slice(0, 4)) - 1;
  const yearStart = `${startYear}-04-01`;
  const yearEnd = `${startYear + 1}-03-31`;
  const yearEvents = events
    .filter((e) => e.event_date <= yearEnd && (e.end_date ?? e.event_date) >= yearStart)
    .sort((a, b) => a.event_date.localeCompare(b.event_date));
  const months = Array.from(new Set(yearEvents.map((e) => e.event_date.slice(0, 7))));
  const monthName = (ym: string) =>
    new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <>
      <PageHeader
        crumb="Academic calendar"
        eyebrow="Academics"
        title="Academic Calendar"
        intro="Holidays, examinations, parent meetings and events, month by month."
      />

      <section className="wrap" style={{ paddingTop: 0 }}>
        <MonthCalendar events={events} today={today} />
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="b-section-head">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Academic year</span>
            <h2>
              {startYear} &ndash; {String(startYear + 1).slice(2)} at a Glance
            </h2>
          </div>
          {files?.map((f) => (
            <a
              key={f.id}
              className={buttonVariants({ variant: "outline" })}
              href={client.storage.from("public").getPublicUrl(f.file_path).data.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download: {f.title} ({fileExtension(f.file_path)})
            </a>
          ))}
        </div>

        {months.length > 0 ? (
          months.map((ym) => (
            <div key={ym} style={{ marginBottom: "2rem" }}>
              <h3 className="h2-sm">{monthName(ym)}</h3>
              <div className="notice-list">
                {yearEvents
                  .filter((e) => e.event_date.slice(0, 7) === ym)
                  .map((e) => (
                    <div className="notice notice-ev" key={e.id}>
                      <span className="date mono">{e.event_date.slice(8, 10)}</span>
                      <div>
                        <h4 className="cal-item-title">{e.title}</h4>
                        <p className="notice-when">{formatEventDate(e.event_date, e.end_date)}</p>
                        {e.description && <p>{e.description}</p>}
                      </div>
                      {e.category ? <Badge variant="tag" className="ev-tag">{e.category}</Badge> : <span />}
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            <div>
              <h2>Calendar coming soon</h2>
              <p>
                Holidays, examinations and events for this academic year will appear here. See <Link href="/events">Events</Link> for what is coming up.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
