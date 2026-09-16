"use client";

import { useState, type FormEvent } from "react";

// UI-only for now — wired to a Supabase `enquiries` table via a Server Action
// once the backend is set up (see project plan, Phase 3).
export default function EnquiryForm() {
  const [status, setStatus] = useState<null | "ok" | "err">(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("err");
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="parentName">Parent / Guardian Name</label>
          <input id="parentName" name="parentName" type="text" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="childAge">Child&apos;s Age</label>
          <input id="childAge" name="childAge" type="text" required />
        </div>
        <div className="field">
          <label htmlFor="grade">Applying for Grade</label>
          <select id="grade" name="grade" required defaultValue="">
            <option value="" disabled>
              Select grade
            </option>
            {["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map(
              (g) => (
                <option key={g}>{g}</option>
              )
            )}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="message">Message (optional)</label>
          <textarea id="message" name="message" placeholder="Anything else you'd like us to know" />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        Send Enquiry
      </button>
      {status === "err" && (
        <p className="form-status err" role="status">
          Online enquiries aren&apos;t connected yet — please call the office directly for now.
        </p>
      )}
      <p className="form-note">
        Prefer to talk directly? Call{" "}
        <a href="tel:+919771020700" style={{ color: "var(--laurel)" }}>
          97710 20700
        </a>{" "}
        or{" "}
        <a href="tel:+917764069741" style={{ color: "var(--laurel)" }}>
          77640 69741
        </a>
        .
      </p>
    </form>
  );
}
