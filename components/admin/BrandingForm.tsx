"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveBranding } from "@/app/admin/(protected)/branding/actions";

type Asset = "logo" | "favicon";

const RULES: Record<Asset, { exts: string[]; maxBytes: number; label: string }> = {
  logo: { exts: ["png", "jpg", "jpeg", "webp", "svg"], maxBytes: 2 * 1024 * 1024, label: "PNG, JPG, WebP or SVG, max 2 MB" },
  favicon: { exts: ["png", "ico", "svg"], maxBytes: 512 * 1024, label: "PNG, ICO or SVG, square, max 512 KB" },
};

export default function BrandingForm({
  logoPath,
  logoUrl,
  faviconPath,
  faviconUrl,
}: {
  logoPath: string | null;
  logoUrl: string | null;
  faviconPath: string | null;
  faviconUrl: string | null;
}) {
  const router = useRouter();
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function extOf(file: File) {
    return (file.name.split(".").pop() ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase();
  }

  function check(kind: Asset, file: File | undefined) {
    if (!file) return null;
    const rule = RULES[kind];
    if (!rule.exts.includes(extOf(file))) return `The ${kind} must be ${rule.label}.`;
    if (file.size > rule.maxBytes) return `The ${kind} must be ${rule.label}.`;
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setSaved(false);

    const logoFile = logoRef.current?.files?.[0];
    const faviconFile = faviconRef.current?.files?.[0];
    const problem = check("logo", logoFile) ?? check("favicon", faviconFile);
    if (problem) return setError(problem);

    setSaving(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    async function upload(kind: Asset, file: File) {
      const path = `branding/${kind}-${crypto.randomUUID()}.${extOf(file)}`;
      const { error: uploadError } = await supabase.storage.from("public").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;
      uploaded.push(path);
      return path;
    }

    try {
      let nextLogo = fd.get("remove_logo") === "on" ? null : logoPath;
      let nextFavicon = fd.get("remove_favicon") === "on" ? null : faviconPath;
      if (logoFile) nextLogo = await upload("logo", logoFile);
      if (faviconFile) nextFavicon = await upload("favicon", faviconFile);

      const result = await saveBranding({ logo_path: nextLogo, favicon_path: nextFavicon });
      if (result.error) {
        // Don't leave orphaned uploads behind if the save failed.
        if (uploaded.length > 0) await supabase.storage.from("public").remove(uploaded);
        throw new Error(result.error);
      }

      if (logoRef.current) logoRef.current.value = "";
      if (faviconRef.current) faviconRef.current.value = "";
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="field">
        <label htmlFor="logo">Logo — {RULES.logo.label}</label>
        <p style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>
          Shown in the site header and footer. A square logo with a transparent background works best.
        </p>
        {logoUrl && (
          <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Current logo" style={{ width: 64, height: 64, objectFit: "contain" }} />
            <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontWeight: 400 }}>
              <input type="checkbox" name="remove_logo" style={{ width: "auto" }} /> Remove current logo
            </label>
          </div>
        )}
        <input id="logo" ref={logoRef} type="file" accept=".png,.jpg,.jpeg,.webp,.svg" />
      </div>

      <div className="field">
        <label htmlFor="favicon">Favicon — {RULES.favicon.label}</label>
        <p style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>
          The small icon in the browser tab. Browsers may take a while to show a new one.
        </p>
        {faviconUrl && (
          <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={faviconUrl} alt="Current favicon" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontWeight: 400 }}>
              <input type="checkbox" name="remove_favicon" style={{ width: "auto" }} /> Remove current favicon
            </label>
          </div>
        )}
        <input id="favicon" ref={faviconRef} type="file" accept=".png,.ico,.svg" />
      </div>

      <button className="btn btn-primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save branding"}
      </button>
      {saved && (
        <p className="form-status ok" role="status">
          Branding saved.
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
