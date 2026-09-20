import EventForm from "@/components/admin/EventForm";
import { createEvent } from "../actions";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>New Event</h1>
      </div>
      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      <EventForm action={createEvent} submitLabel="Create Event" />
    </>
  );
}
