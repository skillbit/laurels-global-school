import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MilestoneForm from "@/components/admin/MilestoneForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { updateMilestone, deleteMilestone } from "../actions";

export default async function EditMilestonePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const { data: milestone } = await supabase
    .from("milestones")
    .select("id, year, title, description, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!milestone) notFound();

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit Milestone</h1>
      </div>
      {query.error && (
        <p className="form-status err" role="alert">
          {query.error}
        </p>
      )}
      <MilestoneForm action={updateMilestone.bind(null, id)} milestone={milestone} submitLabel="Save Changes" />

      <form action={deleteMilestone} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={milestone.id} />
        <ConfirmDeleteButton label="Delete Milestone" confirmText={`Delete "${milestone.title}"? This can't be undone.`} />
      </form>
    </>
  );
}
