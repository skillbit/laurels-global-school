import { getSiteSettings, telHref } from "@/lib/site-settings";
import { buttonVariants } from "@/components/ui/button";

export default async function FactsPanel() {
  const { quickFacts, callPhone } = await getSiteSettings();

  return (
    <div className="facts-panel">
      <h2>Quick Facts</h2>
      {quickFacts.map((f) => (
        <div className="fact-row" key={f.label}>
          <span>{f.label}</span>
          <span className="mono">{f.value}</span>
        </div>
      ))}
      <a className={buttonVariants({ variant: "light" })} href={telHref(callPhone)}>
        Call for Admissions
      </a>
    </div>
  );
}
