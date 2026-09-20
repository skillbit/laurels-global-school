import StaffForm from "@/components/admin/StaffForm";

export default function NewStaffPage() {
  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Add Person</h1>
      </div>
      <StaffForm submitLabel="Add Person" />
    </>
  );
}
