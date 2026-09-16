type Notice = {
  id: string;
  title: string;
  body: string;
  notice_date: string;
  attachment_url: string | null;
  is_published: boolean;
};

export default function NoticeForm({
  action,
  notice,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  notice?: Notice;
  submitLabel: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required defaultValue={notice?.title} />
      </div>
      <div className="field">
        <label htmlFor="notice_date">Date</label>
        <input
          id="notice_date"
          name="notice_date"
          type="date"
          defaultValue={notice?.notice_date ?? today}
        />
      </div>
      <div className="field">
        <label htmlFor="body">Body</label>
        <textarea id="body" name="body" required defaultValue={notice?.body} style={{ minHeight: "140px" }} />
      </div>
      <div className="field">
        <label htmlFor="attachment_url">Attachment URL (optional)</label>
        <input
          id="attachment_url"
          name="attachment_url"
          type="url"
          placeholder="https://…"
          defaultValue={notice?.attachment_url ?? ""}
        />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={notice ? notice.is_published : true}
        />
        <label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public Notices page)
        </label>
      </div>
      <button className="btn btn-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
