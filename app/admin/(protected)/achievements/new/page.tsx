import AchievementForm from "@/components/admin/AchievementForm";

export default function NewAchievementPage() {
  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>New Achievement</h1>
      </div>
      <AchievementForm submitLabel="Create Achievement" />
    </>
  );
}
