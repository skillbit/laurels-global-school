"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createGalleryImage } from "@/app/admin/(protected)/gallery/actions";

export default function GalleryUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image file first.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `gallery/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

      const { error: uploadError } = await supabase.storage.from("public").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      await createGalleryImage({ image_path: path, caption, alt_text: altText });

      setCaption("");
      setAltText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "480px" }}>
      <div className="field">
        <label htmlFor="file">Image</label>
        <input id="file" ref={fileInputRef} type="file" accept="image/*" required />
      </div>
      <div className="field">
        <label htmlFor="caption">Caption (optional)</label>
        <input id="caption" type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="altText">Alt text (for accessibility)</label>
        <input id="altText" type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the photo" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={uploading}>
        {uploading ? "Uploading…" : "Upload Photo"}
      </button>
      {error && (
        <p className="form-status err" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
