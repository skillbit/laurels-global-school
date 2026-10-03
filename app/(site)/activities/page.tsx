import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/site/PageHeader";
import { getDailyActivities } from "@/lib/school-content";
import { todayInIndia } from "@/lib/events";

export const metadata: Metadata = {
  title: "Daily Activities",
  description: "What students did at The Laurels Global School, Dehri-on-Sone, day by day: classroom activities, sports, clubs and celebrations.",
};

const longDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default async function ActivitiesPage() {
  const activities = await getDailyActivities(60);
  const today = todayInIndia();
  const days = Array.from(new Set(activities.map((a) => a.date)));

  return (
    <>
      <PageHeader crumb="Daily activities" eyebrow="School life" title="Daily Activities" intro="A look at what our classes did, day by day." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        {days.length > 0 ? (
          days.map((day) => (
            <div className="da-day" key={day}>
              <h2 className="h2-sm">{day === today ? `Today, ${longDate(day)}` : longDate(day)}</h2>
              <div className="card-grid">
                {activities
                  .filter((a) => a.date === day)
                  .map((a) => (
                    <article className="info-card" key={a.id}>
                      {a.photoUrl && (
                        <div className="info-media">
                          <Image src={a.photoUrl} alt={a.title} fill sizes="(max-width: 520px) 100vw, (max-width: 860px) 50vw, 380px" />
                        </div>
                      )}
                      <div className="body">
                        {a.classLabel && <span className="meta">{a.classLabel}</span>}
                        <h3>{a.title}</h3>
                        {a.description && <p className="da-text">{a.description}</p>}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
            </svg>
            <div>
              <h2>Daily activities coming soon</h2>
              <p>Photos and notes from the classrooms will be shared here.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
