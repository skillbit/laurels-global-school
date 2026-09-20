// Sends a short WhatsApp alert to the school office. Pure functions only (no Next.js
// imports) so they are easy to test. Configured entirely with environment variables;
// if nothing is configured, it quietly does nothing.
//
// Provider "cloud"     = Meta WhatsApp Cloud API (official). Needs WHATSAPP_TOKEN and
//                        WHATSAPP_PHONE_NUMBER_ID; use WHATSAPP_TEMPLATE_NAME for alerts
//                        sent outside the 24-hour window (recommended).
// Provider "callmebot" = free personal-number gateway. Needs CALLMEBOT_API_KEY.
// Recipients: WHATSAPP_TO = comma-separated numbers with country code, e.g. 919771020700

export type WhatsAppResult = { ok: boolean; skipped?: string; error?: string };
type Env = Record<string, string | undefined>;

/** One line, no tabs or newlines (WhatsApp template variables can't contain them). */
export function cleanLine(value: string, max = 300): string {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max);
}

export function recipients(env: Env): string[] {
  return (env.WHATSAPP_TO ?? "")
    .split(",")
    .map((n) => n.replace(/\D/g, ""))
    .filter((n) => n.length >= 10);
}

async function post(doFetch: typeof fetch, url: string, init: RequestInit): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await doFetch(url, { ...init, signal: controller.signal });
    if (res.ok) return null;
    const detail = (await res.text().catch(() => "")).slice(0, 160);
    return `HTTP ${res.status} ${detail}`.trim();
  } catch (err) {
    return err instanceof Error ? err.message : "request failed";
  } finally {
    clearTimeout(timer);
  }
}

export async function sendWhatsApp(
  text: string,
  env: Env = process.env,
  doFetch: typeof fetch = fetch
): Promise<WhatsAppResult> {
  const provider = (env.WHATSAPP_PROVIDER ?? "").trim().toLowerCase();
  if (!provider) return { ok: false, skipped: "WHATSAPP_PROVIDER is not set" };
  const to = recipients(env);
  if (to.length === 0) return { ok: false, skipped: "WHATSAPP_TO has no valid numbers" };
  const message = cleanLine(text, 600);
  const errors: string[] = [];

  if (provider === "cloud") {
    const token = env.WHATSAPP_TOKEN;
    const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneId) return { ok: false, skipped: "WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID missing" };
    const base = env.WHATSAPP_API_BASE || "https://graph.facebook.com";
    const url = `${base}/${env.WHATSAPP_API_VERSION || "v21.0"}/${phoneId}/messages`;
    const template = env.WHATSAPP_TEMPLATE_NAME;

    for (const number of to) {
      const payload = template
        ? {
            messaging_product: "whatsapp",
            to: number,
            type: "template",
            template: {
              name: template,
              language: { code: env.WHATSAPP_TEMPLATE_LANG || "en" },
              components: [{ type: "body", parameters: [{ type: "text", text: message }] }],
            },
          }
        : { messaging_product: "whatsapp", to: number, type: "text", text: { body: message } };
      const err = await post(doFetch, url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (err) errors.push(`${number.slice(-4)}: ${err}`);
    }
  } else if (provider === "callmebot") {
    const keys = (env.CALLMEBOT_API_KEY ?? "").split(",").map((k) => k.trim());
    if (!keys[0]) return { ok: false, skipped: "CALLMEBOT_API_KEY missing" };
    const base = env.WHATSAPP_API_BASE || "https://api.callmebot.com";
    for (const [i, number] of to.entries()) {
      const key = keys[i] || keys[0];
      const url = `${base}/whatsapp.php?phone=${number}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(key)}`;
      const err = await post(doFetch, url, { method: "GET" });
      if (err) errors.push(`${number.slice(-4)}: ${err}`);
    }
  } else {
    return { ok: false, skipped: `Unknown WHATSAPP_PROVIDER "${provider}"` };
  }

  return errors.length === 0 ? { ok: true } : { ok: false, error: errors.join(" | ") };
}
