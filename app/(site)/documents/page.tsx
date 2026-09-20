import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { DOCUMENT_CATEGORIES, fileExtension } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Documents",
  description: "Download the fee structure, admission forms, syllabus, circulars and newsletters of The Laurels Global School.",
};

export default async function DocumentsPage() {
  const client = createPublicClient();
  const { data } = await client
    .from("documents")
    .select("id, title, category, file_path, published_date")
    .eq("is_published", true)
    .order("published_date", { ascending: false });

  const groups = DOCUMENT_CATEGORIES.map((c) => ({
    label: c.label,
    docs: (data ?? []).filter((d) => d.category === c.value),
  })).filter((g) => g.docs.length > 0);

  return (
    <>
      <div className="wrap page-header">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Documents
        </div>
        <span className="eyebrow">Downloads</span>
        <h1>Forms, Fees &amp; Circulars</h1>
      </div>

      <section className="wrap" style={{ paddingTop: 0 }}>
        {groups.length > 0 ? (
          groups.map((g) => (
            <div key={g.label} style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: ".6rem" }}>{g.label}</h2>
              <div className="notice-list">
                {g.docs.map((d) => (
                  <div className="notice" key={d.id}>
                    <span className="date mono">
                      {new Date(`${d.published_date}T00:00:00`).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <div>
                      <h3>{d.title}</h3>
                    </div>
                    <a
                      className="tag"
                      href={client.storage.from("public").getPublicUrl(d.file_path).data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download {fileExtension(d.file_path)}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="coming-soon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 3h8l4 4v14H6V3Z" />
              <path d="M14 3v4h4" />
            </svg>
            <div>
              <h3>No documents yet</h3>
              <p>The fee structure, admission forms and circulars will be available to download here.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
