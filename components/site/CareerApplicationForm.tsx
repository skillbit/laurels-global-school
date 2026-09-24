"use client";

import { useActionState } from "react";
import { submitApplication, type ApplicationState } from "@/app/(site)/careers/actions";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ApplicationState = { status: "idle" };

export default function CareerApplicationForm({ jobs }: { jobs: { id: string; title: string }[] }) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);
  const v = state.values ?? {};

  return (
    <form className="form-card" action={formAction}>
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="applicantName">Full name</Label>
          <Input id="applicantName" name="applicantName" type="text" required autoComplete="name" defaultValue={v.applicantName} />
        </div>
        <div className="field">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={v.phone} />
        </div>
        <div className="field">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} />
        </div>
        <div className="field">
          <Label htmlFor="job">Position</Label>
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
          <Label htmlFor="resume">Resume (optional) — PDF or Word, max 3 MB</Label>
          <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" />
        </div>
        <div className="field full">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea id="message" name="message" placeholder="Tell us about your experience and subjects" defaultValue={v.message} />
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <Label htmlFor="website">Leave this field empty</Label>
        <Input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className={buttonVariants()} type="submit" disabled={pending}>
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
