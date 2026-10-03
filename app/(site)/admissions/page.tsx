import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import FactsPanel from "@/components/site/FactsPanel";
import EnquiryForm from "@/components/site/EnquiryForm";
import { getSiteSettings, telHref } from "@/lib/site-settings";
import { getPageText } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "How to apply to The Laurels Global School, Dehri-on-Sone (Nursery to Class 10, CBSE): admission steps, quick facts and an online enquiry form.",
};

export default async function AdmissionsPage() {
  const [settings, t] = await Promise.all([getSiteSettings(), getPageText()]);
  const phones = settings.phones.map((p) => ({ label: p, href: telHref(p) }));
  return (
    <>
      <PageHeader crumb="Admissions" eyebrow="Admissions" title={t["admissions.title"]} intro={t["admissions.intro"]} />

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="admissions">
          <div className="steps">
            <h2 className="visually-hidden">How admissions work</h2>
            {([1, 2, 3, 4] as const).map((n) => (
              <div className="step" key={n}>
                <span className="idx">{n}</span>
                <div>
                  <h3>{t[`admissions.step.${n}.title`]}</h3>
                  <p>{t[`admissions.step.${n}.text`]}</p>
                </div>
              </div>
            ))}
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
