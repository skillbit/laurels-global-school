import AlumniForm from "@/components/admin/AlumniForm";

export default function NewAlumnusPage() {
  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Add Alumnus</h1>
      </div>
      <AlumniForm submitLabel="Add Alumnus" />
    </>
  );
}
