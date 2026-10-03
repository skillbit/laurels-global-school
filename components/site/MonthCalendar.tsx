"use client";

import { useState } from "react";
import { formatEventDate, type SchoolEvent } from "@/lib/events";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");

// One month at a time, with arrows to move. Days that have an event are marked and
// the month's events are listed underneath (which is what phones mostly read).
export default function MonthCalendar({ events, today }: { events: SchoolEvent[]; today: string }) {
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)) - 1);

  const move = (by: number) => {
    const next = new Date(Date.UTC(year, month + by, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth());
  };

  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const monthStart = `${year}-${pad(month + 1)}-01`;
  const monthEnd = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`;
  const title = new Date(Date.UTC(year, month, 1)).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });

  const inMonth = events
    .filter((e) => e.event_date <= monthEnd && (e.end_date ?? e.event_date) >= monthStart)
    .sort((a, b) => a.event_date.localeCompare(b.event_date));
  const onDay = (date: string) => inMonth.filter((e) => e.event_date <= date && (e.end_date ?? e.event_date) >= date);

  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="cal-nav" onClick={() => move(-1)} aria-label="Previous month">
          &larr;
        </button>
        <h2 aria-live="polite">{title}</h2>
        <button type="button" className="cal-nav" onClick={() => move(1)} aria-label="Next month">
          &rarr;
        </button>
      </div>

      <div className="cal-grid" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <span className="cal-weekday" key={d}>
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span className="cal-cell is-blank" key={`blank-${i}`} />;
          const date = `${year}-${pad(month + 1)}-${pad(day)}`;
          const dayEvents = onDay(date);
          return (
            <span className={`cal-cell${date === today ? " is-today" : ""}${dayEvents.length > 0 ? " has-event" : ""}`} key={date}>
              <b>{day}</b>
              {dayEvents.slice(0, 2).map((e) => (
                <small key={e.id}>{e.title}</small>
              ))}
              {dayEvents.length > 2 && <small>+{dayEvents.length - 2} more</small>}
            </span>
          );
        })}
      </div>

      {inMonth.length > 0 ? (
        <ul className="cal-list">
          {inMonth.map((e) => (
            <li key={e.id}>
              <span className="mono">{formatEventDate(e.event_date, e.end_date)}</span>
              <span>
                <strong>{e.title}</strong>
                {e.category ? <em>{e.category}</em> : null}
                {e.description ? <small>{e.description}</small> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="b-empty">Nothing on the calendar for {title} yet.</p>
      )}
    </div>
  );
}
