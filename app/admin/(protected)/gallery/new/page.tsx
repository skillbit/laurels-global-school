import AlbumForm from "@/components/admin/AlbumForm";

export default function NewAlbumPage() {
  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>New Album</h1>
      </div>
      <AlbumForm submitLabel="Create Album" />
    </>
  );
}
