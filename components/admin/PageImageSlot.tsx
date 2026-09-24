"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { removePageImage, setPageImage } from "@/app/admin/(protected)/page-images/actions";
import { PAGE_IMAGE_ACCEPT, PAGE_IMAGE_MAX_BYTES } from "@/lib/page-images";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PageImageSlot({
  page,
  slot,
  label,
  hint,
  url,
}: {
  page: string;
  slot: string;
  label: string;
  hint: string;
  url: string | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputId = `file-${page}-${slot}`;

  async function upload() {
    const file = fileRef.current?.files?.[0];
    setError(null);
    if (!file) return setError("Choose a photo first.");
    if (file.size > PAGE_IMAGE_MAX_BYTES) return setError("The photo must be smaller than 10 MB.");
    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) return setError("Use a JPG, PNG or WebP photo.");

    setBusy("upload");
    const supabase = createClient();
    const path = `page-images/${page}/${slot}--${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("public")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });
    if (uploadError) {
      setBusy(null);
      return setError(`Upload failed: ${uploadError.message}`);
    }
    const result = await setPageImage(page, slot, path);
    if (result.error) {
      await supabase.storage.from("public").remove([path]);
      setBusy(null);
      return setError(result.error);
    }
    if (fileRef.current) fileRef.current.value = "";
    setBusy(null);
    router.refresh();
  }

  async function remove() {
    setError(null);
    setBusy("remove");
    const result = await removePageImage(page, slot);
    setBusy(null);
    if (result.error) return setError(result.error);
    router.refresh();
  }

  return (
    <div className="pi-slot">
      <div className={`pi-preview${url ? "" : " b-tile"}`}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" />
        ) : (
          <span className="pi-empty">No photo yet: the site shows a placeholder</span>
        )}
      </div>
      <div className="pi-body">
        <h3>{label}</h3>
        <p>{hint}</p>
        <Label className="visually-hidden" htmlFor={inputId}>
          Photo for {label}
        </Label>
        <Input id={inputId} ref={fileRef} type="file" accept={PAGE_IMAGE_ACCEPT} className="file-input" />
        <div className="pi-actions">
          <button className={buttonVariants({ size: "sm" })} type="button" onClick={upload} disabled={busy !== null}>
            {busy === "upload" ? "Uploading…" : url ? "Replace photo" : "Upload photo"}
          </button>
          {url && (
            <button className={buttonVariants({ variant: "danger", size: "sm" })} type="button" onClick={remove} disabled={busy !== null}>
              {busy === "remove" ? "Removing…" : "Remove"}
            </button>
          )}
        </div>
        {error && (
          <p className="form-status err" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
