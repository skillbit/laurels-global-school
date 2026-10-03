import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import PagePhoto from "@/components/site/PagePhoto";
import { getPageImages } from "@/lib/page-images";
import { getPageText } from "@/lib/page-content";
import { getSubjectGroups, getCoCurricular } from "@/lib/school-content";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "CBSE curriculum from Nursery to Class 10 at The Laurels Global School, Dehri-on-Sone: pre-primary, primary, middle and secondary stages, subjects and activities.",
};

const STAGE_NUMBERS = [1, 2, 3, 4] as const;

// Titles and text come from Admin -> Page Text; only the icons live here.
const FACILITY_ICONS = [
  <g key="classroom">
    <rect x="3" y="5" width="18" height="12" rx="1.5" />
    <path d="M8 21h8M12 17v4" strokeLinecap="round" />
  </g>,
  <g key="library">
    <path d="M4 19V5a1 1 0 0 1 1-1h6v16H5a1 1 0 0 1-1-1Z" />
    <path d="M11 4h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-8" />
  </g>,
  <path key="lab" d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" strokeLinejoin="round" />,
  <g key="sports">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </g>,
];

export default async function AcademicsPage() {
  // Photos: Admin -> Page Images (empty spots show a placeholder). Words: Admin -> Page Text.
  const [images, t, subjectGroups, activities] = await Promise.all([
    getPageImages("academics"),
    getPageText(),
    getSubjectGroups(),
    getCoCurricular(),
  ]);
  const activityCards = activities.filter((a) => a.description || a.photoUrl);

  return (
    <>
      <PageHeader crumb="Academics" eyebrow="Academics" title={t["academics.title"]} intro={t["academics.intro"]} />

      {/* ---------- The four stages, each with a photo ---------- */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="b-section-head">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">The learning journey</span>
            <h2>{t["academics.journey.title"]}</h2>
          </div>
          <div className="board-note" style={{ marginTop: 0 }}>
            <span className="pill">{t["board.label"]}</span>
            <span>{t["board.note"]}</span>
          </div>
        </div>
        <ol className="ac-journey">
          {STAGE_NUMBERS.map((n) => (
            <li className="ac-stage" key={n}>
              <PagePhoto
                url={images[`stage-${n}`]}
                alt={`${t[`stage.${n}.title`]} students at The Laurels Global School`}
                className="ac-stage-photo"
                sizes="(max-width: 860px) 100vw, 520px"
                priority={n === 1}
              />
              <div className="ac-stage-copy">
                <span className="ac-step">Stage {n} of 4</span>
                <h3>{t[`stage.${n}.title`]}</h3>
                <p className="ac-grades">{t[`stage.${n}.grades`]}</p>
                <p>{t[`stage.${n}.text`]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Subjects on a crimson band (Admin -> Subjects) ---------- */}
      {subjectGroups.length > 0 && (
        <section className="b-why ac-subjects">
          <div className="wrap">
            <div className="ac-subjects-grid">
              <div className="b-why-head">
                <span className="eyebrow">Core subjects</span>
                <h2>{t["academics.subjects.title"]}</h2>
                <p>{t["academics.subjects.text"]}</p>
              </div>
              <div className="ac-subject-groups">
                {subjectGroups.map((g) => (
                  <div key={g.label}>
                    {subjectGroups.length > 1 && <h3 className="ac-subject-stage">{g.label}</h3>}
                    <ul className="ac-subject-list">
                      {g.subjects.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Activities beside a photo mosaic (Admin -> Co-curricular) ---------- */}
      <section className="wrap">
        <div className="ac-activities">
          <div className="ac-activities-copy">
            <span className="eyebrow">Beyond the classroom</span>
            <h2>{t["academics.activities.title"]}</h2>
            <p>{t["academics.activities.text"]}</p>
            <div className="chip-grid">
              {activities.map((a) => (
                <Badge variant="tag" key={a.name}>
                  {a.name}
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
        {activityCards.length > 0 && (
          <div className="card-grid ac-activity-cards">
            {activityCards.map((a) => (
              <article className="info-card" key={a.name}>
                {a.photoUrl && (
                  <div className="info-media">
                    <Image src={a.photoUrl} alt={a.name} fill sizes="(max-width: 520px) 100vw, (max-width: 860px) 50vw, 380px" />
                  </div>
                )}
                <div className="body">
                  <h3>{a.name}</h3>
                  {a.description && <p>{a.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Facilities ---------- */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <span className="eyebrow">Campus</span>
          <h2>{t["academics.facilities.title"]}</h2>
        </div>
        <div className="ac-facilities">
          {STAGE_NUMBERS.map((n) => (
            <div className="ac-facility" key={n}>
              <span className="b-stage-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {FACILITY_ICONS[n - 1]}
                </svg>
              </span>
              <h3>{t[`academics.facility.${n}.title`]}</h3>
              <p>{t[`academics.facility.${n}.text`]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Next step ---------- */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="ac-cta">
          <div>
            <h2>{t["academics.cta.title"]}</h2>
            <p>{t["academics.cta.text"]}</p>
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
