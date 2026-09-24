"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/(site)/admissions/actions";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: EnquiryState = { status: "idle" };

export default function EnquiryForm({ phones }: { phones: { label: string; href: string }[] }) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const v = state.values ?? {};

  return (
    <form className="form-card" action={formAction}>
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="parentName">Parent / Guardian Name</Label>
          <Input id="parentName" name="parentName" type="text" required autoComplete="name" defaultValue={v.parentName} />
        </div>
        <div className="field">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={v.phone} />
        </div>
        <div className="field">
          <Label htmlFor="childAge">Child&apos;s Age</Label>
          <Input id="childAge" name="childAge" type="text" required defaultValue={v.childAge} />
        </div>
        <div className="field">
          <Label htmlFor="grade">Applying for Grade</Label>
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
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea id="message" name="message" placeholder="Anything else you'd like us to know" defaultValue={v.message} />
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <Label htmlFor="website">Leave this field empty</Label>
        <Input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className={buttonVariants()} type="submit" disabled={pending}>
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
        {phones.map((p, i) => (
          <span key={p.href}>
            {i > 0 && " or "}
            <a href={p.href} style={{ color: "var(--laurel)" }}>
              {p.label}
            </a>
          </span>
        ))}
        .
      </p>
    </form>
  );
}
