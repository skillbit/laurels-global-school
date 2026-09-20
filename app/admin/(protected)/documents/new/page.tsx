import DocumentForm from "@/components/admin/DocumentForm";

export default function NewDocumentPage() {
  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Upload Document</h1>
      </div>
      <DocumentForm submitLabel="Upload Document" />
    </>
  );
}
