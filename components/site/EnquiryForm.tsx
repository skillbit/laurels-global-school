"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/(site)/admissions/actions";

const initialState: EnquiryState = { status: "idle" };

export default function EnquiryForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const v = state.values ?? {};

  return (
    <form className="form-card" action={formAction}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="parentName">Parent / Guardian Name</label>
          <input id="parentName" name="parentName" type="text" required autoComplete="name" defaultValue={v.parentName} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={v.phone} />
        </div>
        <div className="field">
          <label htmlFor="childAge">Child&apos;s Age</label>
          <input id="childAge" name="childAge" type="text" required defaultValue={v.childAge} />
        </div>
        <div className="field">
          <label htmlFor="grade">Applying for Grade</label>
          <select id="grade" name="grade" required defaultValue={v.grade ?? ""}>
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
          <textarea id="message" name="message" placeholder="Anything else you'd like us to know" defaultValue={v.message} />
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send Enquiry"}
      </button>
      {state.status === "ok" && (
        <p className="form-status ok" role="status">
          Thank you! We&apos;ve received your enquiry and will contact you shortly.
        </p>
      )}
      {state.status === "err" && (
        <p className="form-status err" role="alert">
          {state.message}
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
