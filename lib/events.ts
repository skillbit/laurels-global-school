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

const parts = (d: string) => {
  const dt = new Date(`${d}T00:00:00`);
  return {
    day: dt.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: dt.toLocaleDateString("en-IN", { month: "short" }),
    year: dt.getFullYear(),
  };
};

// Single day: "20 Oct 2026". Ranges are shortened where they can be:
// "20 – 28 Oct 2026", "28 Oct – 3 Nov 2026", "28 Dec 2026 – 3 Jan 2027".
export function formatEventDate(start: string, end: string | null) {
  const a = parts(start);
  if (!end || end === start) return `${a.day} ${a.month} ${a.year}`;
  const b = parts(end);
  if (a.year === b.year && a.month === b.month) return `${a.day} – ${b.day} ${b.month} ${b.year}`;
  if (a.year === b.year) return `${a.day} ${a.month} – ${b.day} ${b.month} ${b.year}`;
  return `${a.day} ${a.month} ${a.year} – ${b.day} ${b.month} ${b.year}`;
}
