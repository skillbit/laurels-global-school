import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { getDisclosureSections } from "@/lib/school-content";

export const metadata: Metadata = {
  title: "Mandatory Disclosure",
  description: "Mandatory public disclosure of The Laurels Global School, Dehri-on-Sone, as per CBSE norms: general information, documents, staff and infrastructure.",
};

export default async function MandatoryDisclosurePage() {
  // Filled in from Admin -> Mandatory Disclosure; rows without a value or file stay hidden.
  const sections = await getDisclosureSections();

  return (
    <>
      <PageHeader crumb="Mandatory disclosure" eyebrow="About the School" title="Mandatory Disclosure" intro="Complete information as per CBSE norms." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        {sections.length > 0 ? (
          sections.map((s) => (
            <div className="md-section" key={s.label}>
              <h2 className="h2-sm">{s.label}</h2>
              <dl className="md-list">
                {s.items.map((item) => (
                  <div className="md-row" key={item.id}>
                    <dt>{item.label}</dt>
                    <dd>
                      {item.value &&
                        (/^https:\/\/\S+$/.test(item.value) ? (
                          <a href={item.value} target="_blank" rel="noopener noreferrer">
                            {item.value}
                          </a>
                        ) : (
                          <span>{item.value}</span>
                        ))}
                      {item.fileUrl && (
                        <a className="notice-file" href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                          </svg>
                          View document<span className="visually-hidden">: {item.label}</span>
                        </a>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 3h8l4 4v14H6V3Z" />
              <path d="M14 3v4h4" />
            </svg>
            <div>
              <h2>Disclosure details coming soon</h2>
              <p>The school&apos;s mandatory public disclosure will be published here.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
