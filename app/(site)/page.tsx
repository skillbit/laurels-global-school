import Link from "next/link";
import { WreathMark } from "@/components/site/WreathDefs";
import ValueCard from "@/components/site/ValueCard";
import StageCard from "@/components/site/StageCard";
import FactsPanel from "@/components/site/FactsPanel";

export default function HomePage() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy reveal">
          <span className="eyebrow">CBSE &middot; Nursery to Class 10</span>
          <h1 className="display">
            The Laurels
            <br />
            <em>Global School</em>
          </h1>
          <p className="hero-loc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.4" />
            </svg>
            Near Jln College, NH2, Pahleja Road, Dehri-on-Sone, Rohtas, Bihar
          </p>
          <p className="hero-quote">
            &ldquo;Nurturing confident, curious, and responsible individuals through quality
            education, strong values, and meaningful learning experiences.&rdquo;
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/admissions">
              Admissions Open
            </Link>
            <Link className="btn btn-ghost" href="/contact">
              Visit the Campus
            </Link>
          </div>
        </div>
        <div className="hero-art reveal" aria-hidden="true">
          <div className="ring" />
          <WreathMark className="wreath-lg" />
          <div className="hero-badge">est. — Rohtas, Bihar</div>
        </div>
      </section>

      <div className="wrap">
        <hr className="divider" />
      </div>

      <section className="wrap">
        <div className="section-head">
          <span className="eyebrow">Why Laurels</span>
          <h2>A School Built Around the Child</h2>
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
            title="Technology & Life Skills"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="4" y="5" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
          >
            Practical, future-ready skills alongside academic learning.
          </ValueCard>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-tint">
            <div className="section-head">
              <span className="eyebrow">Academics</span>
              <h2>From Nursery to Class 10</h2>
            </div>
            <div className="ladder">
              <StageCard num="01" grades="Nursery – UKG" title="Pre-Primary">
                Play-based learning that builds early language, motor skills and curiosity.
              </StageCard>
              <StageCard num="02" grades="Classes 1 – 5" title="Primary">
                Foundational literacy, numeracy and inquiry-based learning across core subjects.
              </StageCard>
              <StageCard num="03" grades="Classes 6 – 8" title="Middle School">
                Wider subject exposure with a focus on conceptual clarity and project work.
              </StageCard>
              <StageCard num="04" grades="Classes 9 – 10" title="Secondary">
                CBSE curriculum with focused preparation for board examinations.
              </StageCard>
            </div>
            <div className="board-note">
              <span className="pill">CBSE</span>
              <span>Curriculum follows the Central Board of Secondary Education framework.</span>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <Link className="btn btn-ghost" href="/academics">
                More on Academics &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="admissions">
          <div>
            <div className="section-head">
              <span className="eyebrow">Admissions</span>
              <h2>Joining The Laurels</h2>
            </div>
            <p style={{ color: "var(--ink-soft)", maxWidth: "52ch" }}>
              Admissions are open for the current academic year across Nursery to Class 10.
              Visit the campus or call the office to begin — see the full process and quick
              facts on the Admissions page.
            </p>
            <div style={{ marginTop: "1.4rem", display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/admissions">
                Admissions Process &amp; Enquiry
              </Link>
            </div>
          </div>
          <FactsPanel />
        </div>
      </section>
    </>
  );
}
