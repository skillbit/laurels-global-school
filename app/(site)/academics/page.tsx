import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import PagePhoto from "@/components/site/PagePhoto";
import { getPageImages } from "@/lib/page-images";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "CBSE curriculum from Nursery to Class 10 at The Laurels Global School, Dehri-on-Sone: pre-primary, primary, middle and secondary stages, subjects and activities.",
};

const STAGES = [
  { grades: "Nursery – UKG", title: "Pre-Primary", text: "Play-based learning that builds early language, motor skills and curiosity." },
  { grades: "Classes 1 – 5", title: "Primary", text: "Foundational literacy, numeracy and inquiry-based learning across core subjects." },
  { grades: "Classes 6 – 8", title: "Middle School", text: "Wider subject exposure with a focus on conceptual clarity and project work." },
  { grades: "Classes 9 – 10", title: "Secondary", text: "CBSE curriculum with focused preparation for board examinations." },
];

// TODO: confirm exact subject list per stage
const SUBJECTS = [
  "English", "Hindi", "Mathematics", "Science", "Social Science",
  "Computer Science", "Environmental Studies", "Art & Craft",
  "Physical Education", "Value Education",
];

// TODO: confirm real activities/clubs offered
const ACTIVITIES = [
  "Sports", "Dance & Music", "Elocution & Debate", "Science Exhibition",
  "Art Club", "Annual Day", "Field Trips",
];

const FACILITIES = [
  {
    title: "Smart Classrooms",
    text: "Technology-supported classrooms designed to make lessons interactive and engaging.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="12" rx="1.5" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Library & Reading Corner",
    text: "A quiet space to build reading habits and support independent learning.",
    icon: (
      <>
        <path d="M4 19V5a1 1 0 0 1 1-1h6v16H5a1 1 0 0 1-1-1Z" />
        <path d="M11 4h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-8" />
      </>
    ),
  },
  {
    title: "Science & Computer Labs",
    text: "Hands-on spaces for experiments and early technology skills.",
    icon: <path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" strokeLinejoin="round" />,
  },
  {
    title: "Sports & Play Areas",
    text: "Outdoor space for physical activity, games and team sports.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
      </>
    ),
  },
];

export default async function AcademicsPage() {
  // Set in Admin -> Page Images; empty spots show a placeholder.
  const images = await getPageImages("academics");

  return (
    <>
      <PageHeader
        crumb="Academics"
        eyebrow="Academics"
        title="From Nursery to Class 10"
        intro="A CBSE curriculum that grows with the child, in four stages that build on each other."
      />

      {/* ---------- The four stages, each with a photo ---------- */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="b-section-head">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">The learning journey</span>
            <h2>Four Stages, One Curriculum</h2>
          </div>
          <div className="board-note" style={{ marginTop: 0 }}>
            <span className="pill">CBSE</span>
            <span>Central Board of Secondary Education framework</span>
          </div>
        </div>
        <ol className="ac-journey">
          {STAGES.map((s, i) => (
            <li className="ac-stage" key={s.title}>
              <PagePhoto
                url={images[`stage-${i + 1}`]}
                alt={`${s.title} students at The Laurels Global School`}
                className="ac-stage-photo"
                sizes="(max-width: 860px) 100vw, 520px"
                priority={i === 0}
              />
              <div className="ac-stage-copy">
                <span className="ac-step">Stage {i + 1} of 4</span>
                <h3>{s.title}</h3>
                <p className="ac-grades">{s.grades}</p>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Subjects on a crimson band ---------- */}
      <section className="b-why ac-subjects">
        <div className="wrap">
          <div className="ac-subjects-grid">
            <div className="b-why-head">
              <span className="eyebrow">Core subjects</span>
              <h2>What Students Study</h2>
              <p>Subjects follow the CBSE framework and deepen stage by stage.</p>
            </div>
            <ul className="ac-subject-list">
              {SUBJECTS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Activities beside a photo mosaic ---------- */}
      <section className="wrap">
        <div className="ac-activities">
          <div className="ac-activities-copy">
            <span className="eyebrow">Beyond the classroom</span>
            <h2>Co-curricular &amp; Activities</h2>
            <p>Sport, the arts and events through the year help every child find something they love.</p>
            <div className="chip-grid">
              {ACTIVITIES.map((a) => (
                <Badge variant="tag" key={a}>
                  {a}
                </Badge>
              ))}
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/gallery">
              See the gallery &rarr;
            </Link>
          </div>
          <div className="ac-mosaic">
            {[1, 2, 3].map((n) => (
              <PagePhoto
                key={n}
                url={images[`activities-${n}`]}
                alt="Students taking part in school activities"
                className="ac-mosaic-photo"
                sizes="(max-width: 860px) 50vw, 300px"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Facilities ---------- */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <span className="eyebrow">Campus</span>
          <h2>Built for Learning</h2>
        </div>
        <div className="ac-facilities">
          {FACILITIES.map((f) => (
            <div className="ac-facility" key={f.title}>
              <span className="b-stage-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {f.icon}
                </svg>
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Next step ---------- */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="ac-cta">
          <div>
            <h2>Admissions are open</h2>
            <p>Nursery to Class 10. See how admissions work, or send an enquiry and the office will call you back.</p>
          </div>
          <div className="btns">
            <Link className={buttonVariants({ variant: "light" })} href="/admissions#enquiry">
              Send an enquiry
            </Link>
            <Link className={buttonVariants({ variant: "outline-light" })} href="/admissions">
              How admissions work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
