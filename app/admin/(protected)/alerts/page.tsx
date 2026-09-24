import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { detectProvider, parseRecipients, recipients as envRecipients } from "@/lib/whatsapp";
import { saveAlertSettings, sendTestAlert } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = { title: "WhatsApp Alerts" };

const PROVIDER_LABEL = {
  cloud: "Meta WhatsApp Cloud API (official)",
  callmebot: "CallMeBot (free, needs a key for each number)",
} as const;

export default async function AdminAlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alert_settings")
    .select("whatsapp_recipients, alerts_enabled")
    .eq("id", 1)
    .maybeSingle();
  const tableMissing = Boolean(error);

  const saved = parseRecipients(data?.whatsapp_recipients);
  const active = saved.length > 0 ? saved : envRecipients(process.env);
  const provider = detectProvider(process.env, active);

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>WhatsApp Alerts</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "62ch", marginBottom: "1.4rem" }}>
        When a parent sends an admission enquiry or someone applies for a job, the website sends a short WhatsApp message to
        the numbers below. Every submission is also saved in the Enquiries and Job Applications inboxes.
      </p>

      {params.success && (
        <p className="form-status ok" role="status">
          {params.success}
        </p>
      )}
      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      {tableMissing && (
        <p className="form-status err" role="alert">
          This page needs a one-time database update: run <code>supabase/migrations/0004_alert_settings.sql</code> in the
          Supabase SQL editor.
        </p>
      )}

      <div className="alerts-grid">
        <form action={saveAlertSettings} className="form-card">
          <div className="field">
            <Label htmlFor="whatsapp_recipients">WhatsApp numbers that receive alerts</Label>
            <Textarea
              id="whatsapp_recipients"
              name="whatsapp_recipients"
              rows={4}
              placeholder={"91 97710 20700\n91 77640 69741 | 1234567"}
              defaultValue={data?.whatsapp_recipients ?? ""}
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            />
            <small style={{ color: "var(--ink-faint)", fontSize: ".82rem" }}>
              One number per line, with the country code (91 for India). Up to 5. If you use CallMeBot, add that
              number&apos;s key after a <code>|</code>.
            </small>
          </div>
          <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
            <input
              id="alerts_enabled"
              name="alerts_enabled"
              type="checkbox"
              style={{ width: "auto" }}
              defaultChecked={data ? data.alerts_enabled : true}
            />
            <Label htmlFor="alerts_enabled" style={{ marginBottom: 0 }}>
              Send WhatsApp alerts
            </Label>
          </div>
          <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap" }}>
            <button className={buttonVariants()} type="submit" disabled={tableMissing}>
              Save
            </button>
            <button className={buttonVariants({ variant: "outline" })} type="submit" formAction={sendTestAlert}>
              Send a test message
            </button>
          </div>
        </form>

        <div className="form-card alerts-status">
          <h2 className="h2-sm">Status</h2>
          <dl>
            <dt>Sending service</dt>
            <dd>{provider ? PROVIDER_LABEL[provider] : <strong style={{ color: "var(--laurel)" }}>Not set up yet</strong>}</dd>
            <dt>Numbers</dt>
            <dd>
              {active.length > 0
                ? active.map((r) => `+${r.number}`).join(", ")
                : "None yet"}
              {saved.length === 0 && active.length > 0 && " (from the server settings)"}
            </dd>
          </dl>
          {!provider && (
            <div className="alerts-help">
              <p>
                <strong>Free option: CallMeBot.</strong> From each phone that should get alerts:
              </p>
              <ol>
                <li>
                  Save the CallMeBot number shown on{" "}
                  <a href="https://www.callmebot.com/blog/free-api-whatsapp-messages/" target="_blank" rel="noopener noreferrer">
                    callmebot.com
                  </a>{" "}
                  in your contacts.
                </li>
                <li>
                  Send it the WhatsApp message <code>I allow callmebot to send me messages</code>.
                </li>
                <li>It replies with a key. Add it here after the number, like <code>91 97710 20700 | 1234567</code>.</li>
                <li>Save, then press “Send a test message”.</li>
              </ol>
              <p>
                <strong>Official option: Meta WhatsApp Cloud API.</strong> Needs a Meta business account; your developer adds
                its keys to the server. See “WhatsApp alerts” in the README.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
