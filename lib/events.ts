export type SchoolEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  category: string | null;
};

// Today's date (YYYY-MM-DD) in the school's timezone, so "upcoming" doesn't
// flip early or late depending on where the server runs.
export function todayInIndia() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function splitEvents(events: SchoolEvent[]) {
  const today = todayInIndia();
  const isUpcoming = (e: SchoolEvent) => (e.end_date ?? e.event_date) >= today;
  return {
    upcoming: events.filter(isUpcoming).sort((a, b) => a.event_date.localeCompare(b.event_date)),
    past: events.filter((e) => !isUpcoming(e)).sort((a, b) => b.event_date.localeCompare(a.event_date)),
  };
}

const short = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function formatEventDate(start: string, end: string | null) {
  return end && end !== start ? `${short(start)} – ${short(end)}` : short(start);
}
