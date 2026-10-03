import { notFound } from "next/navigation";
import EntryForm from "@/components/admin/EntryForm";
import { getAdminSection } from "@/lib/admin-sections";

export default async function NewEntryPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: key } = await params;
  const section = getAdminSection(key);
  if (!section) notFound();

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Add {section.singular}</h1>
      </div>
      <EntryForm
        sectionKey={section.key}
        fields={section.fields}
        file={section.file}
        publishedLabel={section.publishedLabel}
        submitLabel={`Add ${section.singular}`}
      />
    </>
  );
}
