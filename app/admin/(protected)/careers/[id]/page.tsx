import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JobPostingForm from "@/components/admin/JobPostingForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { updateJobPosting, deleteJobPosting } from "../actions";

export default async function EditJobPostingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const { data: posting } = await supabase
    .from("job_postings")
    .select("id, title, department, description, posted_date, is_active")
    .eq("id", id)
    .maybeSingle();

  if (!posting) notFound();

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit Job Posting</h1>
      </div>
      {query.error && (
        <p className="form-status err" role="alert">
          {query.error}
        </p>
      )}
      <JobPostingForm action={updateJobPosting.bind(null, id)} posting={posting} submitLabel="Save Changes" />

      <form action={deleteJobPosting} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={posting.id} />
        <ConfirmDeleteButton label="Delete Job Posting" confirmText={`Delete "${posting.title}"? Applications already received are kept. This can't be undone.`} />
      </form>
    </>
  );
}
