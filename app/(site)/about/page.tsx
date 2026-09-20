import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import ValueCard from "@/components/site/ValueCard";
import PersonCard from "@/components/site/PersonCard";
import { getSiteSettings } from "@/lib/site-settings";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Laurels Global School's mission, values and approach to education in Dehri-on-Sone, Bihar.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const publicClient = createPublicClient();
  const { data: staff } = await publicClient
    .from("staff")
    .select("id, name, role, bio, photo_path, group_label")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const photoUrl = (path: string | null) =>
    path ? publicClient.storage.from("public").getPublicUrl(path).data.publicUrl : null;
  const groups = [
    { label: "Leadership", people: staff?.filter((p) => p.group_label === "leadership") ?? [] },
    { label: "Faculty", people: staff?.filter((p) => p.group_label !== "leadership") ?? [] },
  ].filter((g) => g.people.length > 0);

  return (
    <>
      <PageHeader crumb="About" eyebrow="About the School" title="About The Laurels" intro="Our mission, our values, and the people behind the school." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="mission-panel">
          <svg className="leaf" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <use href="#leaf-icon" />
          </svg>
          <p>&ldquo;{settings.missionStatement}&rdquo;</p>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head">
          <span className="eyebrow">What we build</span>
          <h2>Eight Things Every Child Grows In</h2>
        </div>
        <div>
          <div className="values-grid">
            <ValueCard
              title="Confidence"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            >
              Building self-belief through supported, real learning experiences.
            </ValueCard>
            <ValueCard
              title="Curiosity"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              }
            >
              Encouraging students to ask questions and explore ideas.
            </ValueCard>
            <ValueCard
              title="Responsibility"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            >
              Instilling strong values and accountability in everyday choices.
            </ValueCard>
            <ValueCard
              title="Communication"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            >
              Helping students express ideas clearly, in speech and writing.
            </ValueCard>
            <ValueCard
              title="Creativity"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a5 5 0 0 1 5 5c0 2.5-1.5 3.6-2.2 4.8-.5.8-.8 1.5-.8 2.2H10c0-.7-.3-1.4-.8-2.2C8.5 10.6 7 9.5 7 7a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M10 18h4M10.5 21h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            >
              Space for original thinking across art, science and ideas.
            </ValueCard>
            <ValueCard
              title="Critical Thinking"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 21h6M12 17v4M5 3h14l-1 8a6 6 0 0 1-12 0L5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            >
              Learning to reason, question and evaluate with care.
            </ValueCard>
            <ValueCard
              title="Leadership"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l9 4.5-9 4.5-9-4.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M3 11.5v5L12 21l9-4.5v-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            >
              Preparing students to guide, collaborate and take initiative.
            </ValueCard>
            <ValueCard
              title="Technology & Life Skills"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 20h6M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            >
              Practical, future-ready skills alongside academic learning.
            </ValueCard>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-tint">
            <div className="section-head">
              <span className="eyebrow">Our Story</span>
              <h2>History &amp; Milestones</h2>
            </div>
            {/* Real milestones will be added from /admin once the timeline is wired to Supabase (see project plan, Phase 4) */}
            <div className="coming-soon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M12 8v5l3 3" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              <div>
                <h3>The school&apos;s story, in progress</h3>
                <p>Founding year, CBSE affiliation date, and campus milestones will appear here once added from the admin panel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head">
          <span className="eyebrow">Leadership</span>
          <h2>Meet the Team</h2>
        </div>
        {groups.length > 0 ? (
          groups.map((g) => (
            <div key={g.label} style={{ marginBottom: "2rem" }}>
              {groups.length > 1 && <h3 className="h2-sm">{g.label}</h3>}
              <div className="people-grid">
                {g.people.map((p) => (
                  <PersonCard key={p.id} name={p.name} role={p.role} photoUrl={photoUrl(p.photo_path)}>
                    {p.bio}
                  </PersonCard>
                ))}
              </div>
            </div>
          ))
        ) : (
        <div className="coming-soon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
          </svg>
          <div>
            <h3>Leadership profiles coming soon</h3>
            <p>Photos, names and roles for the principal and academic team will be added from the admin panel.</p>
          </div>
        </div>
        )}
      </section>
    </>
  );
}
