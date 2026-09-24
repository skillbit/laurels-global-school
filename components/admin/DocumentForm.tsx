"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveDocument } from "@/app/admin/(protected)/documents/actions";
import { DOCUMENT_ACCEPT, DOCUMENT_CATEGORIES, DOCUMENT_MAX_BYTES } from "@/lib/documents";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type DocumentRow = {
  id: string;
  title: string;
  category: string;
  file_path: string;
  published_date: string;
  is_published: boolean;
};

export default function DocumentForm({
  document: doc,
  fileUrl,
  submitLabel,
}: {
  document?: DocumentRow;
  fileUrl?: string | null;
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
    if (!file && !doc) return setError("Choose a file to upload.");
    if (file && file.size > DOCUMENT_MAX_BYTES) return setError("The file must be smaller than 10 MB.");

    setSaving(true);
    const supabase = createClient();
    let filePath = doc?.file_path ?? "";
    let uploadedPath: string | null = null;

    try {
      if (file) {
        const ext = (file.name.split(".").pop() ?? "pdf").replace(/[^a-z0-9]/gi, "").toLowerCase() || "pdf";
        uploadedPath = `documents/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("public").upload(uploadedPath, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) throw uploadError;
        filePath = uploadedPath;
      }

      const result = await saveDocument(doc?.id ?? null, {
        title: String(fd.get("title") ?? ""),
        category: String(fd.get("category") ?? ""),
        published_date: String(fd.get("published_date") ?? ""),
        is_published: fd.get("is_published") === "on",
        file_path: filePath,
      });

      if (result.error) {
        // Don't leave an orphaned upload behind if the save failed.
        if (uploadedPath) await supabase.storage.from("public").remove([uploadedPath]);
        throw new Error(result.error);
      }

      router.push("/admin/documents?success=saved");
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
          defaultValue={doc?.title}
          placeholder="e.g. Fee Structure 2026–27"
        />
      </div>
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="category">Category</Label>
          <select id="category" name="category" required defaultValue={doc?.category ?? ""}>
            <option value="" disabled>
              Select category
            </option>
            {DOCUMENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <Label htmlFor="published_date">Date</Label>
          <Input id="published_date" name="published_date" type="date" required defaultValue={doc?.published_date ?? today} />
        </div>
      </div>
      <div className="field">
        <Label htmlFor="file">{doc ? "Replace file (optional)" : "File"} — PDF, Word, Excel or image, max 10 MB</Label>
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--laurel)", fontSize: ".85rem", fontWeight: 600 }}>
            View current file &rarr;
          </a>
        )}
        <Input id="file" ref={fileRef} type="file" accept={DOCUMENT_ACCEPT} required={!doc} />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={doc ? doc.is_published : true}
        />
        <Label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public Documents page)
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
