import type { Metadata } from "next";
import Link from "next/link";
import FactsPanel from "@/components/site/FactsPanel";
import EnquiryForm from "@/components/site/EnquiryForm";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admissions process, quick facts and enquiry form for The Laurels Global School, Dehri-on-Sone. Nursery to Class 10, CBSE.",
};

export default function AdmissionsPage() {
  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Admissions
        </div>
        <span className="eyebrow">Admissions</span>
        <h1>Joining The Laurels</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="admissions">
          <div className="steps">
            <div className="step">
              <span className="idx">1</span>
              <div>
                <h3>Enquire</h3>
                <p>Call the school office, or visit the campus near Jln College on NH2, Pahleja Road. You can also submit the enquiry form on this page.</p>
              </div>
            </div>
            <div className="step">
              <span className="idx">2</span>
              <div>
                <h3>Share Details</h3>
                <p>Tell us the child&apos;s age and the grade you&apos;re applying for, along with basic documents.</p>
              </div>
            </div>
            <div className="step">
              <span className="idx">3</span>
              <div>
                <h3>Interaction</h3>
                <p>A short, age-appropriate interaction with the child, and parents for younger grades.</p>
              </div>
            </div>
            <div className="step">
              <span className="idx">4</span>
              <div>
                <h3>Confirmation</h3>
                <p>Seat confirmation and fee details are shared directly by the school office.</p>
              </div>
            </div>
          </div>
          <FactsPanel />
        </div>
      </section>

      <section id="enquiry" style={{ background: "var(--surface-alt)", borderBlock: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Enquiry Form</span>
            <h2>Request a Callback</h2>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
