import "server-only";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanLine, parseRecipients, recipients, sendWhatsApp, type Recipient, type WhatsAppResult } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";

// If a burst of submissions arrives (a spam flood), stop alerting so the office
// phone isn't buried and no messaging costs run up. Submissions are still saved.
const FLOOD_WINDOW_MINUTES = 10;
const FLOOD_MAX = 8;

async function isFlood(table: "enquiries" | "career_applications"): Promise<boolean> {
  try {
    const since = new Date(Date.now() - FLOOD_WINDOW_MINUTES * 60_000).toISOString();
    const { count } = await createAdminClient()
      .from(table)
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    return (count ?? 0) > FLOOD_MAX;
  } catch {
    return false;
  }
}

export type AlertSettings = { enabled: boolean; recipientsText: string; recipients: Recipient[]; fromAdmin: boolean };

/**
 * Who gets alerts: the list saved in Admin -> WhatsApp Alerts, otherwise the
 * WHATSAPP_TO environment variable (also used if migration 0004 hasn't been run).
 */
export async function loadAlertSettings(): Promise<AlertSettings> {
  try {
    const { data, error } = await createAdminClient()
      .from("alert_settings")
      .select("whatsapp_recipients, alerts_enabled")
      .eq("id", 1)
      .maybeSingle();
    if (!error && data) {
      const list = parseRecipients(data.whatsapp_recipients);
      if (list.length > 0 || !data.alerts_enabled) {
        return { enabled: data.alerts_enabled, recipientsText: data.whatsapp_recipients ?? "", recipients: list, fromAdmin: true };
      }
    }
  } catch {
    // fall through to the environment
  }
  return { enabled: true, recipientsText: "", recipients: recipients(process.env), fromAdmin: false };
}

export async function sendAlertNow(text: string): Promise<WhatsAppResult> {
  const settings = await loadAlertSettings();
  if (!settings.enabled) return { ok: false, skipped: "Alerts are switched off" };
  return sendWhatsApp(text, process.env, fetch, settings.recipients);
}

// Runs after the response has been sent, and can never make the form fail.
function alertLater(table: "enquiries" | "career_applications", text: string) {
  after(async () => {
    try {
      if (await isFlood(table)) {
        console.warn(`[alert] skipped WhatsApp for ${table}: more than ${FLOOD_MAX} in ${FLOOD_WINDOW_MINUTES} minutes`);
        return;
      }
      const result = await sendAlertNow(text);
      if (!result.ok) console[result.skipped ? "info" : "error"]("[alert] WhatsApp not sent:", result.skipped ?? result.error);
    } catch (err) {
      console.error("[alert] WhatsApp error:", err instanceof Error ? err.message : err);
    }
  });
}

export function alertNewEnquiry(e: { parentName: string; phone: string; grade: string; childAge: string; message: string }) {
  const note = e.message ? ` Note: ${cleanLine(e.message, 160)}` : "";
  alertLater(
    "enquiries",
    `New admission enquiry: ${cleanLine(e.parentName, 80)} (${cleanLine(e.phone, 20)}) for ${cleanLine(e.grade, 30)}, child age ${cleanLine(e.childAge, 30)}.${note} Reply from ${SITE_URL}/admin/enquiries`
  );
}

export function alertNewApplication(a: { name: string; phone: string; position: string; hasResume: boolean }) {
  alertLater(
    "career_applications",
    `New job application: ${cleanLine(a.name, 80)} (${cleanLine(a.phone, 20)}) for ${cleanLine(a.position, 100)}${a.hasResume ? ", resume attached" : ""}. See ${SITE_URL}/admin/careers/applications`
  );
}
