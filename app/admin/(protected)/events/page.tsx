import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { formatEventDate } from "@/lib/events";
import { deleteEvent, toggleEventPublished } from "./actions";

const MESSAGES: Record<string, string> = {
  created: "Event created.",
  updated: "Event updated.",
  deleted: "Event deleted.",
};

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date, end_date, category, is_published")
    .order("event_date", { ascending: false });

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Events</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/events/new">
          New Event
        </Link>
      </div>

      {params.success && MESSAGES[params.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[params.success]}
        </p>
      )}

      {events && events.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Category</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.title}</td>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>
                  {formatEventDate(ev.event_date, ev.end_date)}
                </td>
                <td>{ev.category ?? "—"}</td>
                <td>
                  <span className={`badge ${ev.is_published ? "badge-published" : "badge-draft"}`}>
                    {ev.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: ".5rem" }}>
                  <Link className="btn btn-ghost btn-row" href={`/admin/events/${ev.id}`}>
                    Edit
                  </Link>
                  <form action={toggleEventPublished}>
                    <input type="hidden" name="id" value={ev.id} />
                    <input type="hidden" name="next" value={(!ev.is_published).toString()} />
                    <button className="btn btn-ghost btn-row" type="submit">
                      {ev.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={ev.id} />
                    <ConfirmDeleteButton confirmText={`Delete "${ev.title}"? This can't be undone.`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No events yet — click &ldquo;New Event&rdquo; to add one.</div>
      )}
    </>
  );
}
