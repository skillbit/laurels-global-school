import { createClient } from "@/lib/supabase/server";
import BrandingForm from "@/components/admin/BrandingForm";

export default async function AdminBrandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("logo_path, favicon_path").eq("id", 1).maybeSingle();

  const bucket = supabase.storage.from("public");
  const urlOf = (path: string | null | undefined) => (path ? bucket.getPublicUrl(path).data.publicUrl : null);

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Branding</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", marginBottom: "1.4rem" }}>
        Upload the school logo and browser-tab icon. Until you do, the site uses its default laurel mark and icon. Social links are in Site Settings.
      </p>
      <BrandingForm
        logoPath={data?.logo_path ?? null}
        logoUrl={urlOf(data?.logo_path)}
        faviconPath={data?.favicon_path ?? null}
        faviconUrl={urlOf(data?.favicon_path)}
      />
    </>
  );
}
