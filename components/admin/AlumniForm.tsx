"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveAlumnus } from "@/app/admin/(protected)/alumni/actions";

type Alumnus = {
  id: string;
  name: string;
  batch_year: number | null;
  note: string | null;
  photo_path: string | null;
  sort_order: number;
  is_published: boolean;
};

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function AlumniForm({
  alumnus,
  photoUrl,
  submitLabel,
}: {
  alumnus?: Alumnus;
  photoUrl?: string | null;
  submitLabel: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);

    const file = fileRef.current?.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return setError("The photo must be an image file.");
      if (file.size > MAX_PHOTO_BYTES) return setError("The photo must be smaller than 5 MB.");
    }

    setSaving(true);
    const supabase = createClient();
    let photoPath = fd.get("remove_photo") === "on" ? null : (alumnus?.photo_path ?? null);
    let uploadedPath: string | null = null;

    try {
      if (file) {
        const ext = (file.name.split(".").pop() ?? "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
        uploadedPath = `alumni/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("public").upload(uploadedPath, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) throw uploadError;
        photoPath = uploadedPath;
      }

      const batch = String(fd.get("batch_year") ?? "").trim();
      const result = await saveAlumnus(alumnus?.id ?? null, {
        name: String(fd.get("name") ?? ""),
        batch_year: batch ? Number(batch) : null,
        note: String(fd.get("note") ?? ""),
        sort_order: Number(fd.get("sort_order") ?? 0),
        is_published: fd.get("is_published") === "on",
        photo_path: photoPath,
      });

      if (result.error) {
        // Don't leave an orphaned upload behind if the save failed.
        if (uploadedPath) await supabase.storage.from("public").remove([uploadedPath]);
        throw new Error(result.error);
      }

      router.push("/admin/alumni?success=saved");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required maxLength={100} defaultValue={alumnus?.name} />
        </div>
        <div className="field">
          <label htmlFor="batch_year">Batch year (optional)</label>
          <input
            id="batch_year"
            name="batch_year"
            type="number"
            min={1980}
            max={new Date().getFullYear() + 1}
            defaultValue={alumnus?.batch_year ?? ""}
            placeholder="e.g. 2018"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="note">Note (optional) — what they do now, or a message to students</label>
        <textarea id="note" name="note" maxLength={1000} defaultValue={alumnus?.note ?? ""} style={{ minHeight: "110px" }} />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="sort_order">Display order (smaller shows first)</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={alumnus?.sort_order ?? 0} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="photo">Photo (optional, max 5 MB)</label>
        {photoUrl && (
          <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
            <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontWeight: 400 }}>
              <input type="checkbox" name="remove_photo" style={{ width: "auto" }} /> Remove current photo
            </label>
          </div>
        )}
        <input id="photo" ref={fileRef} type="file" accept="image/*" />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={alumnus ? alumnus.is_published : true}
        />
        <label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public Alumni page)
        </label>
      </div>
      <button className="btn btn-primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : submitLabel}
      </button>
      {error && (
        <p className="form-status err" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
