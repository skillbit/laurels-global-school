import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StaffForm from "@/components/admin/StaffForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteStaff } from "../actions";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: person } = await supabase
    .from("staff")
    .select("id, name, role, bio, photo_path, group_label, sort_order, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!person) notFound();

  const photoUrl = person.photo_path
    ? supabase.storage.from("public").getPublicUrl(person.photo_path).data.publicUrl
    : null;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit {person.name}</h1>
      </div>
      <StaffForm staff={person} photoUrl={photoUrl} submitLabel="Save Changes" />

      <form action={deleteStaff} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={person.id} />
        <ConfirmDeleteButton label="Delete Person" confirmText={`Delete ${person.name}? This can't be undone.`} />
      </form>
    </>
  );
}
