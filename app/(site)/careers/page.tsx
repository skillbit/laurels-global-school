import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import CareerApplicationForm from "@/components/site/CareerApplicationForm";

export const metadata: Metadata = {
  title: "Careers",
  description: "Teaching and staff openings at The Laurels Global School, Dehri-on-Sone. Apply online.",
};

export default async function CareersPage() {
  const { data: jobs } = await createPublicClient()
    .from("job_postings")
    .select("id, title, department, description, posted_date")
    .eq("is_active", true)
    .order("posted_date", { ascending: false });

  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Careers
        </div>
        <span className="eyebrow">Careers</span>
        <h1>Work with Us</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: ".6rem" }}>Current openings</h2>
        {jobs && jobs.length > 0 ? (
          <div className="notice-list">
            {jobs.map((j) => (
              <div className="notice" key={j.id}>
                <span className="date mono">
                  {new Date(`${j.posted_date}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div>
                  <h3>{j.title}</h3>
                  {j.description && <p style={{ whiteSpace: "pre-line" }}>{j.description}</p>}
                </div>
                {j.department ? <span className="tag">{j.department}</span> : <span />}
              </div>
            ))}
          </div>
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            <div>
              <h3>No openings right now</h3>
              <p>You can still send a general application below and we&apos;ll keep it on file.</p>
            </div>
          </div>
        )}
      </section>

      <section className="wrap" id="apply">
        <div className="section-head">
          <span className="eyebrow">Apply</span>
          <h2>Send your application</h2>
        </div>
        <CareerApplicationForm jobs={(jobs ?? []).map((j) => ({ id: j.id, title: j.title }))} />
      </section>
    </>
  );
}
