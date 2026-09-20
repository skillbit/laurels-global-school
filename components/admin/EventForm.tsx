type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  category: string | null;
  is_published: boolean;
};

export default function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  event?: EventRow;
  submitLabel: string;
}) {
  return (
    <form action={action} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required maxLength={150} defaultValue={event?.title} />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="event_date">Start date</label>
          <input id="event_date" name="event_date" type="date" required defaultValue={event?.event_date} />
        </div>
        <div className="field">
          <label htmlFor="end_date">End date (optional, for multi-day events)</label>
          <input id="end_date" name="end_date" type="date" defaultValue={event?.end_date ?? ""} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="category">Category (optional)</label>
        <input
          id="category"
          name="category"
          type="text"
          list="event-categories"
          maxLength={40}
          defaultValue={event?.category ?? ""}
          placeholder="e.g. Holiday, Exam, Sports"
        />
        <datalist id="event-categories">
          {["Holiday", "Exam", "Sports", "Cultural", "Meeting", "Admissions"].map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          maxLength={2000}
          defaultValue={event?.description ?? ""}
          style={{ minHeight: "110px" }}
        />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={event ? event.is_published : true}
        />
        <label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public Events page)
        </label>
      </div>
      <button className="btn btn-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
