import { getSiteSettings } from "@/lib/site-settings";
import { saveSettings } from "./actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const s = await getSiteSettings();
  const factsText = s.quickFacts.map((f) => `${f.label} | ${f.value}`).join("\n");

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Site Settings</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", marginBottom: "1.4rem" }}>
        Everything here appears on the public site. Fields show what is live right now; changes go live as soon as you save.
      </p>

      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      {params.success && (
        <p className="form-status ok" role="status">
          Settings saved.
        </p>
      )}

      <form action={saveSettings} className="form-card" style={{ maxWidth: "720px" }}>
        <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}>Announcement banner</h2>
        <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
          <input id="banner_active" name="banner_active" type="checkbox" style={{ width: "auto" }} defaultChecked={s.bannerActive} />
          <label htmlFor="banner_active" style={{ marginBottom: 0 }}>
            Show the banner at the top of every page
          </label>
        </div>
        <div className="field">
          <label htmlFor="banner_message">Message</label>
          <input id="banner_message" name="banner_message" type="text" defaultValue={s.bannerMessage} maxLength={200} />
        </div>
        <div className="field">
          <label htmlFor="banner_link">&ldquo;Learn more&rdquo; link (a page like /admissions, or a full https:// link)</label>
          <input id="banner_link" name="banner_link" type="text" defaultValue={s.bannerLink} />
        </div>

        <hr className="divider" style={{ margin: "1.4rem 0" }} />
        <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}>Contact &amp; location</h2>
        <div className="field">
          <label htmlFor="address">Address</label>
          <textarea id="address" name="address" defaultValue={s.address} style={{ minHeight: "80px" }} />
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="phone_primary">Primary phone (used for Call buttons)</label>
            <input id="phone_primary" name="phone_primary" type="tel" defaultValue={s.phonePrimary} />
          </div>
          <div className="field">
            <label htmlFor="phone_secondary">Other phone numbers (separate several with commas)</label>
            <input id="phone_secondary" name="phone_secondary" type="tel" defaultValue={s.phoneSecondary} />
          </div>
          <div className="field">
            <label htmlFor="email">Email (optional)</label>
            <input id="email" name="email" type="email" defaultValue={s.email ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="office_hours">Office hours / note</label>
            <input id="office_hours" name="office_hours" type="text" defaultValue={s.officeHours} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="map_embed_url">Google Map embed link (optional — leave empty to show the map automatically from the address)</label>
          <textarea
            id="map_embed_url"
            name="map_embed_url"
            defaultValue={s.mapEmbedUrl ?? ""}
            placeholder="Google Maps → Share → Embed a map → paste the iframe code or its src link"
            style={{ minHeight: "80px" }}
          />
        </div>

        <hr className="divider" style={{ margin: "1.4rem 0" }} />
        <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}>Social links (optional)</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="facebook_url">Facebook</label>
            <input id="facebook_url" name="facebook_url" type="url" placeholder="https://…" defaultValue={s.facebookUrl ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="instagram_url">Instagram</label>
            <input id="instagram_url" name="instagram_url" type="url" placeholder="https://…" defaultValue={s.instagramUrl ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="youtube_url">YouTube</label>
            <input id="youtube_url" name="youtube_url" type="url" placeholder="https://…" defaultValue={s.youtubeUrl ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="x_url">X (Twitter)</label>
            <input id="x_url" name="x_url" type="url" placeholder="https://…" defaultValue={s.xUrl ?? ""} />
          </div>
        </div>

        <hr className="divider" style={{ margin: "1.4rem 0" }} />
        <h2 style={{ fontSize: "1.15rem", marginBottom: ".8rem" }}>Homepage &amp; About text</h2>
        <div className="field">
          <label htmlFor="hero_quote">Homepage quote</label>
          <textarea id="hero_quote" name="hero_quote" defaultValue={s.heroQuote} style={{ minHeight: "90px" }} />
        </div>
        <div className="field">
          <label htmlFor="mission_statement">Mission statement (About page)</label>
          <textarea id="mission_statement" name="mission_statement" defaultValue={s.missionStatement} style={{ minHeight: "140px" }} />
        </div>
        <div className="field">
          <label htmlFor="quick_facts">Quick facts — one per line as &ldquo;Label | Value&rdquo; (max 8)</label>
          <textarea id="quick_facts" name="quick_facts" defaultValue={factsText} style={{ minHeight: "120px" }} />
        </div>

        <button className="btn btn-primary" type="submit">
          Save settings
        </button>
      </form>
    </>
  );
}
