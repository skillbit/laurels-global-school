import { getSiteSettings, telHref } from "@/lib/site-settings";

export default async function FactsPanel() {
  const { quickFacts, callPhone } = await getSiteSettings();

  return (
    <div className="facts-panel">
      <h3>Quick Facts</h3>
      {quickFacts.map((f) => (
        <div className="fact-row" key={f.label}>
          <span>{f.label}</span>
          <span className="mono">{f.value}</span>
        </div>
      ))}
      <a className="btn btn-gold" href={telHref(callPhone)}>
        Call for Admissions
      </a>
    </div>
  );
}
