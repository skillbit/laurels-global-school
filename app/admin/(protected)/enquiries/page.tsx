import { createClient } from "@/lib/supabase/server";
import { deleteEnquiry, toggleEnquiryStatus } from "./actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, parent_name, phone, child_age, grade_applying, message, status, created_at")
    .order("created_at", { ascending: false });

  const newCount = enquiries?.filter((e) => e.status === "new").length ?? 0;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Enquiries</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", marginBottom: "1.2rem" }}>
        Admission enquiries submitted from the public Admissions page. {newCount} new.
      </p>

      {enquiries && enquiries.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Received</th>
              <th>Parent / Guardian</th>
              <th>Phone</th>
              <th>Child</th>
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => {
              const isNew = e.status === "new";
              return (
                <tr key={e.id}>
                  <td className="mono" style={{ whiteSpace: "nowrap" }}>
                    {new Date(e.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td>
                    <strong>{e.parent_name}</strong>
                    {e.message && (
                      <div style={{ color: "var(--ink-soft)", fontSize: ".85rem", marginTop: ".25rem", maxWidth: "36ch" }}>
                        {e.message}
                      </div>
                    )}
                  </td>
                  <td className="mono">
                    <a href={`tel:${e.phone}`}>{e.phone}</a>
                  </td>
                  <td>
                    {e.grade_applying}
                    {e.child_age && <div style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>Age {e.child_age}</div>}
                  </td>
                  <td>
                    <Badge variant={isNew ? "new" : "draft"}>
                      {isNew ? "New" : "Contacted"}
                    </Badge>
                  </td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <form action={toggleEnquiryStatus}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="next" value={isNew ? "contacted" : "new"} />
                      <button type="submit" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        {isNew ? "Mark contacted" : "Mark new"}
                      </button>
                    </form>
                    <form action={deleteEnquiry}>
                      <input type="hidden" name="id" value={e.id} />
                      <ConfirmDeleteButton confirmText={`Delete the enquiry from ${e.parent_name}? This can't be undone.`} />
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty">No enquiries yet — they&apos;ll appear here when parents submit the Admissions form.</div>
      )}
    </>
  );
}
