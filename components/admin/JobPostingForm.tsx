type JobPosting = {
  id: string;
  title: string;
  department: string | null;
  description: string | null;
  posted_date: string;
  is_active: boolean;
};

export default function JobPostingForm({
  action,
  posting,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  posting?: JobPosting;
  submitLabel: string;
}) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  return (
    <form action={action} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="field">
        <label htmlFor="title">Job title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={150}
          defaultValue={posting?.title}
          placeholder="e.g. Mathematics Teacher (Classes 6–10)"
        />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="department">Department (optional)</label>
          <input id="department" name="department" type="text" maxLength={80} defaultValue={posting?.department ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="posted_date">Posted on</label>
          <input id="posted_date" name="posted_date" type="date" defaultValue={posting?.posted_date ?? today} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="description">Description, qualifications and how to apply (optional)</label>
        <textarea
          id="description"
          name="description"
          maxLength={4000}
          defaultValue={posting?.description ?? ""}
          style={{ minHeight: "160px" }}
        />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={posting ? posting.is_active : true}
        />
        <label htmlFor="is_active" style={{ marginBottom: 0 }}>
          Open (listed on the public Careers page)
        </label>
      </div>
      <button className="btn btn-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
