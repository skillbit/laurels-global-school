"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NOTICE_ATTACHMENT_ACCEPT, NOTICE_ATTACHMENT_MAX_BYTES } from "@/lib/documents";

type Notice = {
  id: string;
  title: string;
  body: string;
  notice_date: string;
  attachment_url: string | null;
  is_published: boolean;
};

export default function NoticeForm({
  action,
  notice,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  notice?: Notice;
  submitLabel: string;
}) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The file goes straight from the browser to Supabase Storage (no Server Action
  // body limit); only its public link is sent with the rest of the form.
  async function submit(formData: FormData) {
    setError(null);
    const file = fileRef.current?.files?.[0];
    formData.delete("attachment_file");

    if (file) {
      if (file.size > NOTICE_ATTACHMENT_MAX_BYTES) return setError("The file must be smaller than 10 MB.");
      setSaving(true);
      const supabase = createClient();
      const ext = (file.name.split(".").pop() ?? "pdf").replace(/[^a-z0-9]/gi, "").toLowerCase() || "pdf";
      const path = `notices/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });
      if (uploadError) {
        setSaving(false);
        return setError(`Upload failed: ${uploadError.message}`);
      }
      formData.set("attachment_url", supabase.storage.from("public").getPublicUrl(path).data.publicUrl);
    }

    setSaving(true);
    await action(formData);
    setSaving(false);
  }

  return (
    <form action={submit} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required maxLength={200} defaultValue={notice?.title} />
      </div>
      <div className="field">
        <label htmlFor="notice_date">Date</label>
        <input id="notice_date" name="notice_date" type="date" defaultValue={notice?.notice_date ?? today} />
      </div>
      <div className="field">
        <label htmlFor="body">Body</label>
        <textarea id="body" name="body" required defaultValue={notice?.body} style={{ minHeight: "140px" }} />
      </div>
      <div className="field">
        <label htmlFor="attachment_file">
          {notice?.attachment_url ? "Replace attachment (optional)" : "Attach a file (optional)"} — PDF, Word, Excel or image,
          max 10 MB
        </label>
        {notice?.attachment_url && (
          <a
            href={notice.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--laurel)", fontSize: ".85rem", fontWeight: 600 }}
          >
            View current attachment &rarr;
          </a>
        )}
        <input id="attachment_file" name="attachment_file" ref={fileRef} type="file" accept={NOTICE_ATTACHMENT_ACCEPT} />
      </div>
      <div className="field">
        <label htmlFor="attachment_url">Or link to a file (optional)</label>
        <input
          id="attachment_url"
          name="attachment_url"
          type="url"
          placeholder="https://…"
          defaultValue={notice?.attachment_url ?? ""}
        />
        <small style={{ color: "var(--ink-faint)", fontSize: ".8rem" }}>
          Clear this box to remove the attachment. An uploaded file replaces the link.
        </small>
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={notice ? notice.is_published : true}
        />
        <label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public Notices page)
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
