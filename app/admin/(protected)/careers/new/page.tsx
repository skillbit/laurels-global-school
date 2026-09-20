import JobPostingForm from "@/components/admin/JobPostingForm";
import { createJobPosting } from "../actions";

export default async function NewJobPostingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>New Job Posting</h1>
      </div>
      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      <JobPostingForm action={createJobPosting} submitLabel="Create Job Posting" />
    </>
  );
}
