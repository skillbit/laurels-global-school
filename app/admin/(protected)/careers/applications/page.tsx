import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteApplication, toggleApplicationStatus } from "./actions";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("career_applications")
    .select("id, applicant_name, phone, email, message, resume_path, status, created_at, job_postings(title)")
    .order("created_at", { ascending: false });

  // Resumes live in a private bucket — generate short-lived signed links (1 hour).
  const resumeUrls = new Map<string, string>();
  const paths = (applications ?? []).map((a) => a.resume_path).filter((p): p is string => Boolean(p));
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage.from("private").createSignedUrls(paths, 3600);
    signed?.forEach((s) => {
      if (s.path && s.signedUrl) resumeUrls.set(s.path, s.signedUrl);
    });
  }

  const newCount = applications?.filter((a) => a.status === "new").length ?? 0;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Job Applications</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", marginBottom: "1.2rem" }}>
        Applications from the public Careers page. {newCount} new.{" "}
        <Link href="/admin/careers" style={{ color: "var(--laurel)", fontWeight: 600 }}>
          Manage job postings
        </Link>
      </p>

      {applications && applications.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Received</th>
              <th>Applicant</th>
              <th>Position</th>
              <th>Resume</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => {
              const isNew = a.status === "new";
              const posting = Array.isArray(a.job_postings) ? a.job_postings[0] : a.job_postings;
              const resumeUrl = a.resume_path ? resumeUrls.get(a.resume_path) : null;
              return (
                <tr key={a.id}>
                  <td className="mono" style={{ whiteSpace: "nowrap" }}>
                    {new Date(a.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td>
                    <strong>{a.applicant_name}</strong>
                    <div className="mono" style={{ fontSize: ".85rem" }}>
                      <a href={`tel:${a.phone}`}>{a.phone}</a>
                    </div>
                    {a.email && (
                      <div style={{ fontSize: ".85rem" }}>
                        <a href={`mailto:${a.email}`}>{a.email}</a>
                      </div>
                    )}
                    {a.message && (
                      <div style={{ color: "var(--ink-soft)", fontSize: ".85rem", marginTop: ".25rem", maxWidth: "36ch" }}>
                        {a.message}
                      </div>
                    )}
                  </td>
                  <td>{posting?.title ?? "General application"}</td>
                  <td>
                    {resumeUrl ? (
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--laurel)", fontWeight: 600 }}>
                        View resume
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span className={`badge ${isNew ? "badge-new" : "badge-draft"}`}>{isNew ? "New" : "Reviewed"}</span>
                  </td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <form action={toggleApplicationStatus}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="next" value={isNew ? "reviewed" : "new"} />
                      <button type="submit" className="btn btn-ghost btn-row">
                        {isNew ? "Mark reviewed" : "Mark new"}
                      </button>
                    </form>
                    <form action={deleteApplication}>
                      <input type="hidden" name="id" value={a.id} />
                      <ConfirmDeleteButton confirmText={`Delete the application from ${a.applicant_name} and their resume? This can't be undone.`} />
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No applications yet — they&apos;ll appear here when candidates apply from the Careers page.</div>
      )}
    </>
  );
}
