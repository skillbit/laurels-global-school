import type { Metadata } from "next";
import Link from "next/link";
import ValueCard from "@/components/site/ValueCard";
import PersonCard from "@/components/site/PersonCard";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Laurels Global School's mission, values and approach to education in Dehri-on-Sone, Bihar.",
};

export default function AboutPage() {
  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / About
        </div>
        <span className="eyebrow">About the School</span>
        <h1>About The Laurels</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="about-grid">
          <div className="mission-block">
            <svg className="leaf" viewBox="0 0 24 24" fill="none" style={{ color: "var(--gold)" }}>
              <use href="#leaf-icon" />
            </svg>
            <p>
              &ldquo;Our mission is to nurture confident, curious, and responsible individuals
              through quality education, strong values, and meaningful learning experiences. We
              aim to develop not only academic excellence but also communication, creativity,
              critical thinking, leadership, technology, and life skills&mdash;preparing every
              student to succeed in a changing world and contribute positively to society.&rdquo;
            </p>
          </div>
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

      <section style={{ background: "var(--surface-alt)", borderBlock: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Our Story</span>
            <h2>History &amp; Milestones</h2>
          </div>
          {/* TODO: replace with real founding year and milestones via /admin once the timeline is wired to Supabase */}
          <div className="timeline">
            <div className="item">
              <span className="yr mono">TODO</span>
              <div>
                <h3>School founded</h3>
                <p>Add the founding year and a line about how the school began.</p>
              </div>
            </div>
            <div className="item">
              <span className="yr mono">TODO</span>
              <div>
                <h3>CBSE affiliation</h3>
                <p>Add the year of CBSE affiliation and affiliation number.</p>
              </div>
            </div>
            <div className="item">
              <span className="yr mono">TODO</span>
              <div>
                <h3>Campus expansion</h3>
                <p>Add any milestones — new blocks, labs, expanded grades, etc.</p>
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
        {/* TODO: replace with real staff entries managed from /admin/staff */}
        <div className="people-grid">
          <PersonCard name="Principal's Name" role="Principal">
            A short note on their background and vision for the school — TODO.
          </PersonCard>
          <PersonCard name="Vice Principal's Name" role="Vice Principal">
            A short note on their role and experience — TODO.
          </PersonCard>
          <PersonCard name="Academic Coordinator" role="Coordinator">
            A short note on their role and experience — TODO.
          </PersonCard>
        </div>
      </section>
    </>
  );
}
