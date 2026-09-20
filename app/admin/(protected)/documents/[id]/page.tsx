import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DocumentForm from "@/components/admin/DocumentForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteDocument } from "../actions";

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("id, title, category, file_path, published_date, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!doc) notFound();

  const fileUrl = supabase.storage.from("public").getPublicUrl(doc.file_path).data.publicUrl;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit Document</h1>
      </div>
      <DocumentForm document={doc} fileUrl={fileUrl} submitLabel="Save Changes" />

      <form action={deleteDocument} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={doc.id} />
        <ConfirmDeleteButton label="Delete Document" confirmText={`Delete "${doc.title}" and its file? This can't be undone.`} />
      </form>
    </>
  );
}
