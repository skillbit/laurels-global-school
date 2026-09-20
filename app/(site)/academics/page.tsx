import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import FacilityCard from "@/components/site/FacilityCard";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "CBSE curriculum from Nursery to Class 10 at The Laurels Global School — pre-primary, primary, middle and secondary stages.",
};

const STAGES = [
  { grades: "Nursery – UKG", title: "Pre-Primary", text: "Play-based learning that builds early language, motor skills and curiosity." },
  { grades: "Classes 1 – 5", title: "Primary", text: "Foundational literacy, numeracy and inquiry-based learning across core subjects." },
  { grades: "Classes 6 – 8", title: "Middle School", text: "Wider subject exposure with a focus on conceptual clarity and project work." },
  { grades: "Classes 9 – 10", title: "Secondary", text: "CBSE curriculum with focused preparation for board examinations." },
];

const SUBJECTS = [
  "English", "Hindi", "Mathematics", "Science", "Social Science",
  "Computer Science", "Environmental Studies", "Art & Craft",
  "Physical Education", "Value Education",
];

const ACTIVITIES = [
  "Sports", "Dance & Music", "Elocution & Debate", "Science Exhibition",
  "Art Club", "Annual Day", "Field Trips",
];

export default function AcademicsPage() {
  return (
    <>
      <PageHeader crumb="Academics" eyebrow="Academics" title="From Nursery to Class 10" intro="A CBSE curriculum that grows with the child, from Nursery to Class 10." />

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="h-steps">
          {STAGES.map((st, i) => (
            <div className="h-step" key={st.title}>
              <span className="idx" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="grades">{st.grades}</span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </div>
          ))}
        </div>
        <div className="board-note">
          <span className="pill">CBSE</span>
          <span>Curriculum follows the Central Board of Secondary Education framework.</span>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-tint">
            <div className="section-head">
              <span className="eyebrow">Core Subjects</span>
              <h2>What Students Study</h2>
            </div>
            {/* TODO: confirm exact subject list per stage */}
            <div className="chip-grid">
              {SUBJECTS.map((s) => (
                <span className="chip" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head">
          <span className="eyebrow">Beyond the Classroom</span>
          <h2>Co-curricular &amp; Activities</h2>
        </div>
        {/* TODO: confirm real activities/clubs offered */}
        <div className="chip-grid">
          {ACTIVITIES.map((a) => (
            <span className="chip" key={a}>{a}</span>
          ))}
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-tint">
            <div className="section-head">
              <span className="eyebrow">Campus</span>
              <h2>Built for Learning</h2>
            </div>
            <div className="facility-grid">
            <FacilityCard
              title="Smart Classrooms"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              }
            >
              Technology-supported classrooms designed to make lessons interactive and engaging.
            </FacilityCard>
            <FacilityCard
              title="Library & Reading Corner"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 19V5a1 1 0 0 1 1-1h6v16H5a1 1 0 0 1-1-1Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M11 4h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              }
            >
              A quiet space to build reading habits and support independent learning.
            </FacilityCard>
            <FacilityCard
              title="Science & Computer Labs"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              }
            >
              Hands-on spaces for experiments and early technology skills.
            </FacilityCard>
            <FacilityCard
              title="Sports & Play Areas"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              }
            >
              Outdoor space for physical activity, games and team sports.
            </FacilityCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
