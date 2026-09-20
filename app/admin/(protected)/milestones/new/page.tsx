import MilestoneForm from "@/components/admin/MilestoneForm";
import { createMilestone } from "../actions";

export default async function NewMilestonePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Add Milestone</h1>
      </div>
      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      <MilestoneForm action={createMilestone} submitLabel="Add Milestone" />
    </>
  );
}
