"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addAlbumPhotos, createAlbum, updateAlbum } from "@/app/admin/(protected)/gallery/actions";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Album = {
  id: string;
  title: string;
  album_date: string;
  is_published: boolean;
};

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 40;

export default function AlbumForm({ album, submitLabel }: { album?: Album; submitLabel: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setSaved(false);

    const files = Array.from(fileRef.current?.files ?? []);
    if (files.length > MAX_FILES) return setError(`Add up to ${MAX_FILES} photos at a time.`);
    const notImage = files.find((f) => !f.type.startsWith("image/"));
    if (notImage) return setError(`"${notImage.name}" isn't an image file.`);
    const tooBig = files.find((f) => f.size > MAX_PHOTO_BYTES);
    if (tooBig) return setError(`"${tooBig.name}" is larger than 10 MB.`);

    const input = {
      title: String(fd.get("title") ?? ""),
      album_date: String(fd.get("album_date") ?? ""),
      is_published: fd.get("is_published") === "on",
    };

    setBusy("Saving album…");
    try {
      let albumId = album?.id;
      if (albumId) {
        const r = await updateAlbum(albumId, input);
        if (r.error) throw new Error(r.error);
      } else {
        const r = await createAlbum(input);
        if (r.error || !r.id) throw new Error(r.error ?? "Couldn't create the album.");
        albumId = r.id;
      }

      // Upload photos straight from the browser to storage, one at a time.
      const supabase = createClient();
      const uploaded: string[] = [];
      const failed: string[] = [];
      for (const [i, file] of files.entries()) {
        setBusy(`Uploading photo ${i + 1} of ${files.length}…`);
        const ext = (file.name.split(".").pop() ?? "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
        const path = `gallery/${albumId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("public").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) failed.push(file.name);
        else uploaded.push(path);
      }

      if (uploaded.length > 0) {
        const r = await addAlbumPhotos(albumId, uploaded);
        if (r.error) {
          await supabase.storage.from("public").remove(uploaded);
          throw new Error(r.error);
        }
      }

      const warning = failed.length > 0 ? `These photos couldn't be uploaded: ${failed.join(", ")}. Add them again below.` : null;
      if (album) {
        if (fileRef.current) fileRef.current.value = "";
        if (warning) setError(warning);
        else setSaved(true);
        router.refresh();
      } else if (warning) {
        router.push(`/admin/gallery/${albumId}?error=${encodeURIComponent(warning)}`);
      } else {
        router.push("/admin/gallery?success=created");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="title">Album title</Label>
          <Input id="title" name="title" type="text" required maxLength={120} defaultValue={album?.title} placeholder="e.g. Sports Day 2026" />
        </div>
        <div className="field">
          <Label htmlFor="album_date">Date (today by default)</Label>
          <Input id="album_date" name="album_date" type="date" required defaultValue={album?.album_date ?? today} />
        </div>
      </div>
      <div className="field">
        <Label htmlFor="photos">{album ? "Add more photos" : "Photos"} — select several at once, max 10 MB each</Label>
        <Input id="photos" ref={fileRef} type="file" accept="image/*" multiple />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={album ? album.is_published : true}
        />
        <Label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public Gallery page)
        </Label>
      </div>
      <button className={buttonVariants()} type="submit" disabled={busy !== null}>
        {busy ?? submitLabel}
      </button>
      {saved && (
        <p className="form-status ok" role="status">
          Album saved.
        </p>
      )}
      {error && (
        <p className="form-status err" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
