import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AlumniForm from "@/components/admin/AlumniForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAlumnus } from "../actions";

export default async function EditAlumnusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: alumnus } = await supabase
    .from("alumni")
    .select("id, name, batch_year, note, photo_path, sort_order, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!alumnus) notFound();

  const photoUrl = alumnus.photo_path ? supabase.storage.from("public").getPublicUrl(alumnus.photo_path).data.publicUrl : null;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit {alumnus.name}</h1>
      </div>
      <AlumniForm alumnus={alumnus} photoUrl={photoUrl} submitLabel="Save Changes" />

      <form action={deleteAlumnus} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={alumnus.id} />
        <ConfirmDeleteButton label="Delete Alumnus" confirmText={`Delete ${alumnus.name}? This can't be undone.`} />
      </form>
    </>
  );
}
