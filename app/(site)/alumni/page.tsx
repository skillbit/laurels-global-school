import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import PersonCard from "@/components/site/PersonCard";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Former students of The Laurels Global School and where they are today.",
};

export default async function AlumniPage() {
  const client = createPublicClient();
  const { data: alumni } = await client
    .from("alumni")
    .select("id, name, batch_year, note, photo_path")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("batch_year", { ascending: false });

  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Alumni
        </div>
        <span className="eyebrow">Alumni</span>
        <h1>Where Our Students Go</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        {alumni && alumni.length > 0 ? (
          <div className="people-grid">
            {alumni.map((a) => (
              <PersonCard
                key={a.id}
                name={a.name}
                role={a.batch_year ? `Batch of ${a.batch_year}` : "Alumnus"}
                photoUrl={a.photo_path ? client.storage.from("public").getPublicUrl(a.photo_path).data.publicUrl : null}
              >
                {a.note}
              </PersonCard>
            ))}
          </div>
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
            </svg>
            <div>
              <h3>Alumni stories coming soon</h3>
              <p>We&apos;ll feature former students and what they&apos;re doing now right here.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
