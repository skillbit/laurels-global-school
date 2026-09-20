import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AchievementForm from "@/components/admin/AchievementForm";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAchievement } from "../actions";

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: item } = await supabase
    .from("achievements")
    .select("id, title, description, category, photo_path, achievement_date, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!item) notFound();

  const photoUrl = item.photo_path ? supabase.storage.from("public").getPublicUrl(item.photo_path).data.publicUrl : null;

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Edit Achievement</h1>
      </div>
      <AchievementForm achievement={item} photoUrl={photoUrl} submitLabel="Save Changes" />

      <form action={deleteAchievement} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={item.id} />
        <ConfirmDeleteButton label="Delete Achievement" confirmText={`Delete "${item.title}"? This can't be undone.`} />
      </form>
    </>
  );
}
