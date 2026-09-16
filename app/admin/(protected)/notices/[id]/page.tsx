import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NoticeForm from "@/components/admin/NoticeForm";
import { updateNotice, deleteNotice } from "../actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function EditNoticePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const { data: notice } = await supabase
    .from("notices")
    .select("id, title, body, notice_date, attachment_url, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!notice) notFound();

  const updateWithId = updateNotice.bind(null, id);

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit Notice</h1>
      </div>
      {query.error && (
        <p className="form-status err" role="alert">
          {query.error}
        </p>
      )}
      <NoticeForm action={updateWithId} notice={notice} submitLabel="Save Changes" />

      <form action={deleteNotice} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={notice.id} />
        <ConfirmDeleteButton label="Delete Notice" confirmText={`Delete "${notice.title}"? This can't be undone.`} />
      </form>
    </>
  );
}
