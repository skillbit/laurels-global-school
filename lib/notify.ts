import "server-only";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanLine, sendWhatsApp } from "@/lib/whatsapp";
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

// Runs after the response has been sent, and can never make the form fail.
function alertLater(table: "enquiries" | "career_applications", text: string) {
  after(async () => {
    try {
      if (await isFlood(table)) {
        console.warn(`[alert] skipped WhatsApp for ${table}: more than ${FLOOD_MAX} in ${FLOOD_WINDOW_MINUTES} minutes`);
        return;
      }
      const result = await sendWhatsApp(text);
      if (!result.ok && !result.skipped) console.error("[alert] WhatsApp failed:", result.error);
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
