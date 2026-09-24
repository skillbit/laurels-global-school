"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveAchievement } from "@/app/admin/(protected)/achievements/actions";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Achievement = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  photo_path: string | null;
  achievement_date: string;
  is_published: boolean;
};

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function AchievementForm({
  achievement,
  photoUrl,
  submitLabel,
}: {
  achievement?: Achievement;
  photoUrl?: string | null;
  submitLabel: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

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
    let photoPath = fd.get("remove_photo") === "on" ? null : (achievement?.photo_path ?? null);
    let uploadedPath: string | null = null;

    try {
      if (file) {
        const ext = (file.name.split(".").pop() ?? "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
        uploadedPath = `achievements/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("public").upload(uploadedPath, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) throw uploadError;
        photoPath = uploadedPath;
      }

      const result = await saveAchievement(achievement?.id ?? null, {
        title: String(fd.get("title") ?? ""),
        description: String(fd.get("description") ?? ""),
        category: String(fd.get("category") ?? ""),
        achievement_date: String(fd.get("achievement_date") ?? ""),
        is_published: fd.get("is_published") === "on",
        photo_path: photoPath,
      });

      if (result.error) {
        // Don't leave an orphaned upload behind if the save failed.
        if (uploadedPath) await supabase.storage.from("public").remove([uploadedPath]);
        throw new Error(result.error);
      }

      router.push("/admin/achievements?success=saved");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="field">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          maxLength={150}
          defaultValue={achievement?.title}
          placeholder="e.g. Class 10 board results 2026"
        />
      </div>
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="achievement_date">Date</Label>
          <Input
            id="achievement_date"
            name="achievement_date"
            type="date"
            required
            defaultValue={achievement?.achievement_date ?? today}
          />
        </div>
        <div className="field">
          <Label htmlFor="category">Category (optional)</Label>
          <Input
            id="category"
            name="category"
            type="text"
            list="achievement-categories"
            maxLength={40}
            defaultValue={achievement?.category ?? ""}
            placeholder="e.g. Academics, Sports"
          />
          <datalist id="achievement-categories">
            {["Board results", "Academics", "Sports", "Arts & culture", "Olympiad", "Community"].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="field">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          maxLength={1000}
          defaultValue={achievement?.description ?? ""}
          style={{ minHeight: "110px" }}
        />
      </div>
      <div className="field">
        <Label htmlFor="photo">Photo (optional, max 5 MB)</Label>
        {photoUrl && (
          <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="" style={{ width: 96, height: 64, borderRadius: 8, objectFit: "cover" }} />
            <Label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontWeight: 400 }}>
              <input type="checkbox" name="remove_photo" style={{ width: "auto" }} /> Remove current photo
            </Label>
          </div>
        )}
        <Input id="photo" ref={fileRef} type="file" accept="image/*" />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={achievement ? achievement.is_published : true}
        />
        <Label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public Achievements page)
        </Label>
      </div>
      <button className={buttonVariants()} type="submit" disabled={saving}>
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
