import NoticeForm from "@/components/admin/NoticeForm";
import { createNotice } from "../actions";

export default async function NewNoticePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>New Notice</h1>
      </div>
      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      <NoticeForm action={createNotice} submitLabel="Create Notice" />
    </>
  );
}
