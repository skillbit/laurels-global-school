"use client";

import { useActionState } from "react";
import { submitApplication, type ApplicationState } from "@/app/(site)/careers/actions";

const initialState: ApplicationState = { status: "idle" };

export default function CareerApplicationForm({ jobs }: { jobs: { id: string; title: string }[] }) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);
  const v = state.values ?? {};

  return (
    <form className="form-card" action={formAction}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="applicantName">Full name</label>
          <input id="applicantName" name="applicantName" type="text" required autoComplete="name" defaultValue={v.applicantName} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={v.phone} />
        </div>
        <div className="field">
          <label htmlFor="email">Email (optional)</label>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} />
        </div>
        <div className="field">
          <label htmlFor="job">Position</label>
          <select id="job" name="job" defaultValue={v.job ?? ""}>
            <option value="">General application</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="resume">Resume (optional) — PDF or Word, max 3 MB</label>
          <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" />
        </div>
        <div className="field full">
          <label htmlFor="message">Message (optional)</label>
          <textarea id="message" name="message" placeholder="Tell us about your experience and subjects" defaultValue={v.message} />
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Submit Application"}
      </button>
      {state.status === "ok" && (
        <p className="form-status ok" role="status">
          Thank you! We&apos;ve received your application and will contact you if there&apos;s a fit.
        </p>
      )}
      {state.status === "err" && (
        <p className="form-status err" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
