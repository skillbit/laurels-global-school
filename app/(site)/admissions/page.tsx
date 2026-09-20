import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import FactsPanel from "@/components/site/FactsPanel";
import EnquiryForm from "@/components/site/EnquiryForm";
import { getSiteSettings, telHref } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admissions process, quick facts and enquiry form for The Laurels Global School, Dehri-on-Sone. Nursery to Class 10, CBSE.",
};

export default async function AdmissionsPage() {
  const settings = await getSiteSettings();
  const phones = settings.phones.map((p) => ({ label: p, href: telHref(p) }));
  return (
    <>
      <PageHeader crumb="Admissions" eyebrow="Admissions" title="Joining The Laurels" intro="Four simple steps from the first call to a confirmed seat." />

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

      <section id="enquiry">
        <div className="wrap">
          <div className="section-tint">
            <div className="section-head">
              <span className="eyebrow">Enquiry Form</span>
              <h2>Request a Callback</h2>
            </div>
            <EnquiryForm phones={phones} />
          </div>
        </div>
      </section>
    </>
  );
}
