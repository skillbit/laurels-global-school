import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EntryForm from "@/components/admin/EntryForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { getAdminSection, sectionColumns } from "@/lib/admin-sections";
import { deleteEntry } from "../actions";

export default async function EditEntryPage({ params }: { params: Promise<{ section: string; id: string }> }) {
  const { section: key, id } = await params;
  const section = getAdminSection(key);
  if (!section) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from(section.table).select(sectionColumns(section)).eq("id", id).maybeSingle();
  const entry = data as unknown as Record<string, unknown> | null;
  if (!entry) notFound();

  const path = section.file ? (entry[section.file.column] as string | null) : null;
  const fileUrl = path ? supabase.storage.from("public").getPublicUrl(path).data.publicUrl : null;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit {section.singular}</h1>
      </div>
      <EntryForm
        sectionKey={section.key}
        fields={section.fields}
        file={section.file}
        publishedLabel={section.publishedLabel}
        entry={entry}
        fileUrl={fileUrl}
        submitLabel="Save Changes"
      />

      <form action={deleteEntry.bind(null, section.key)} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={String(entry.id)} />
        <ConfirmDeleteButton
          label={`Delete ${section.singular}`}
          confirmText={`Delete "${String(entry[section.titleField] ?? "")}"? This can't be undone.`}
        />
      </form>
    </>
  );
}
