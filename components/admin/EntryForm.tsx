"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveEntry } from "@/app/admin/(protected)/[section]/actions";
import type { SectionField, SectionFile } from "@/lib/admin-sections";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// One form for every simple admin list (see lib/admin-sections.ts): the fields, and
// the optional photo or document, come from the section's description.
export default function EntryForm({
  sectionKey,
  fields,
  file,
  publishedLabel,
  entry,
  fileUrl,
  submitLabel,
}: {
  sectionKey: string;
  fields: readonly SectionField[];
  file?: SectionFile;
  publishedLabel: string;
  entry?: Record<string, unknown>;
  fileUrl?: string | null;
  submitLabel: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const currentPath = file ? ((entry?.[file.column] as string | null | undefined) ?? null) : null;

  const initial = (f: SectionField) => {
    const saved = entry?.[f.name];
    if (saved !== null && saved !== undefined) return String(saved);
    if (f.type === "date" && f.today && !entry) return today;
    if (f.type === "number") return "0";
    return "";
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);

    const picked = fileRef.current?.files?.[0];
    if (file && picked) {
      const ext = `.${(picked.name.split(".").pop() ?? "").toLowerCase()}`;
      if (!file.accept.split(",").includes(ext)) return setError(`Allowed file types: ${file.accept.replaceAll(",", ", ")}.`);
      if (picked.size > file.maxBytes) return setError(`The file must be smaller than ${Math.round(file.maxBytes / 1024 / 1024)} MB.`);
    }

    setSaving(true);
    const supabase = createClient();
    let filePath = fd.get("remove_file") === "on" ? null : currentPath;
    let uploadedPath: string | null = null;

    try {
      if (file && picked) {
        const ext = (picked.name.split(".").pop() ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase();
        uploadedPath = `${file.folder}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("public").upload(uploadedPath, picked, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) throw uploadError;
        filePath = uploadedPath;
      }

      const result = await saveEntry(sectionKey, (entry?.id as string | undefined) ?? null, {
        values: Object.fromEntries(fields.map((f) => [f.name, String(fd.get(f.name) ?? "")])),
        is_published: fd.get("is_published") === "on",
        file_path: filePath,
      });

      if (result.error) {
        // Don't leave an orphaned upload behind if the save failed.
        if (uploadedPath) await supabase.storage.from("public").remove([uploadedPath]);
        throw new Error(result.error);
      }

      router.push(`/admin/${sectionKey}?success=saved`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "620px" }}>
      {fields.map((f) => (
        <div className="field" key={f.name}>
          <Label htmlFor={f.name}>{f.label}</Label>
          {f.type === "textarea" ? (
            <Textarea id={f.name} name={f.name} required={f.required} maxLength={f.max} defaultValue={initial(f)} style={{ minHeight: "110px" }} />
          ) : f.type === "select" ? (
            <select id={f.name} name={f.name} required={f.required} defaultValue={initial(f) || f.options?.[0]?.value}>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={f.name}
              name={f.name}
              type={f.type}
              required={f.required}
              maxLength={f.max}
              min={f.type === "number" ? 0 : undefined}
              max={f.type === "number" ? 9999 : undefined}
              defaultValue={initial(f)}
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}

      {file && (
        <div className="field">
          <Label htmlFor="entry_file">{file.label}</Label>
          {fileUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".3rem", flexWrap: "wrap" }}>
              {file.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fileUrl} alt="" style={{ width: 96, height: 64, borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Open current file
                </a>
              )}
              <Label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontWeight: 400 }}>
                <input type="checkbox" name="remove_file" style={{ width: "auto" }} /> Remove current {file.image ? "photo" : "file"}
              </Label>
            </div>
          )}
          <Input id="entry_file" ref={fileRef} type="file" accept={file.accept} />
        </div>
      )}

      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={entry ? Boolean(entry.is_published) : true}
        />
        <Label htmlFor="is_published" style={{ marginBottom: 0 }}>
          {publishedLabel}
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
