"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { parseRecipients } from "@/lib/whatsapp";
import { sendAlertNow } from "@/lib/notify";

function back(kind: "error" | "success", message: string): never {
  redirect(`/admin/alerts?${kind}=${encodeURIComponent(message)}`);
}

export async function saveAlertSettings(formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("whatsapp_recipients") || "").trim();
  const enabled = formData.get("alerts_enabled") === "on";

  const badLine = raw
    .split(/[\n,]+/)
    .some((line) => line.trim() && parseRecipients(line).length === 0);
  const list = parseRecipients(raw);
  if (badLine) {
    back("error", "One of the numbers isn't valid. Use the full number with country code, e.g. 91 97710 20700.");
  }
  if (list.length > 5) back("error", "Add at most 5 numbers.");
  if (enabled && list.length === 0) back("error", "Add at least one WhatsApp number, or switch alerts off.");

  // Store one tidy line per number.
  const tidy = list.map((r) => (r.key ? `${r.number} | ${r.key}` : r.number)).join("\n");
  const supabase = await createClient();
  const { error } = await supabase
    .from("alert_settings")
    .upsert({ id: 1, whatsapp_recipients: tidy || null, alerts_enabled: enabled, updated_at: new Date().toISOString() });
  if (error) back("error", error.message);

  revalidatePath("/admin/alerts");
  back("success", "Saved.");
}

export async function sendTestAlert() {
  await requireAdmin();
  const result = await sendAlertNow(
    "Test message from The Laurels Global School website. WhatsApp alerts for enquiries and job applications are working."
  );
  if (result.ok) back("success", "Test message sent. Check WhatsApp on each number.");
  back("error", `Not sent: ${result.skipped ?? result.error ?? "unknown error"}`);
}
