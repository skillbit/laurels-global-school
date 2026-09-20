import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventForm from "@/components/admin/EventForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { updateEvent, deleteEvent } from "../actions";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("id, title, description, event_date, end_date, category, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!event) notFound();

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit Event</h1>
      </div>
      {query.error && (
        <p className="form-status err" role="alert">
          {query.error}
        </p>
      )}
      <EventForm action={updateEvent.bind(null, id)} event={event} submitLabel="Save Changes" />

      <form action={deleteEvent} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={event.id} />
        <ConfirmDeleteButton label="Delete Event" confirmText={`Delete "${event.title}"? This can't be undone.`} />
      </form>
    </>
  );
}
