// Sends a short WhatsApp alert to the school office. Pure functions only (no Next.js
// imports) so they are easy to test. If nothing is configured, it quietly does nothing.
//
// Who receives it: set in Admin -> WhatsApp Alerts (passed in as `to`), otherwise
// WHATSAPP_TO = comma-separated numbers with country code, e.g. 919771020700.
//
// Provider "cloud"     = Meta WhatsApp Cloud API (official). Needs WHATSAPP_TOKEN and
//                        WHATSAPP_PHONE_NUMBER_ID; use WHATSAPP_TEMPLATE_NAME for alerts
//                        sent outside the 24-hour window (recommended).
// Provider "callmebot" = free personal-number gateway. Each number needs its own key
//                        (from the admin page, or CALLMEBOT_API_KEY in the same order).
// WHATSAPP_PROVIDER picks one; when it is empty, "cloud" is used if its credentials
// are set, otherwise "callmebot" if a recipient has a key.

export type WhatsAppResult = { ok: boolean; skipped?: string; error?: string };
export type Recipient = { number: string; key?: string };
type Env = Record<string, string | undefined>;

/** One line, no tabs or newlines (WhatsApp template variables can't contain them). */
export function cleanLine(value: string, max = 300): string {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max);
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Parses the admin list: one recipient per line (or comma separated), optionally
 * followed by "| key" for CallMeBot. A 10-digit Indian number gets 91 in front.
 */
export function parseRecipients(text: string | null | undefined): Recipient[] {
  const seen = new Set<string>();
  const out: Recipient[] = [];
  for (const line of (text ?? "").split(/[\n,]+/)) {
    const [rawNumber, rawKey] = line.split("|").map((p) => p.trim());
    let number = digits(rawNumber ?? "");
    if (number.length === 10) number = `91${number}`;
    if (number.length < 11 || number.length > 15 || seen.has(number)) continue;
    seen.add(number);
    const key = rawKey?.replace(/[^\w-]/g, "");
    out.push(key ? { number, key } : { number });
  }
  return out;
}

/** Recipients from environment variables (fallback when none are set in the admin). */
export function recipients(env: Env): Recipient[] {
  const keys = (env.CALLMEBOT_API_KEY ?? "").split(",").map((k) => k.trim());
  return parseRecipients(env.WHATSAPP_TO).map((r, i) => {
    const key = keys[i] || keys[0];
    return key ? { ...r, key } : r;
  });
}

export function detectProvider(env: Env, to: Recipient[]): "cloud" | "callmebot" | "" {
  const set = (env.WHATSAPP_PROVIDER ?? "").trim().toLowerCase();
  if (set === "cloud" || set === "callmebot") return set;
  if (set) return "";
  if (env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID) return "cloud";
  if (to.some((r) => r.key) || env.CALLMEBOT_API_KEY) return "callmebot";
  return "";
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
  doFetch: typeof fetch = fetch,
  to: Recipient[] = recipients(env)
): Promise<WhatsAppResult> {
  if (to.length === 0) return { ok: false, skipped: "No WhatsApp numbers are set" };
  const provider = detectProvider(env, to);
  if (!provider) {
    return env.WHATSAPP_PROVIDER
      ? { ok: false, skipped: `Unknown WHATSAPP_PROVIDER "${env.WHATSAPP_PROVIDER}"` }
      : { ok: false, skipped: "No WhatsApp sending service is set up" };
  }
  const message = cleanLine(text, 600);
  const errors: string[] = [];

  if (provider === "cloud") {
    const token = env.WHATSAPP_TOKEN;
    const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneId) return { ok: false, skipped: "WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID missing" };
    const base = env.WHATSAPP_API_BASE || "https://graph.facebook.com";
    const url = `${base}/${env.WHATSAPP_API_VERSION || "v21.0"}/${phoneId}/messages`;
    const template = env.WHATSAPP_TEMPLATE_NAME;

    for (const { number } of to) {
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
  } else {
    const fallbackKey = (env.CALLMEBOT_API_KEY ?? "").split(",")[0]?.trim();
    const base = env.WHATSAPP_API_BASE || "https://api.callmebot.com";
    for (const { number, key = fallbackKey } of to) {
      if (!key) {
        errors.push(`${number.slice(-4)}: no CallMeBot key for this number`);
        continue;
      }
      const url = `${base}/whatsapp.php?phone=${number}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(key)}`;
      const err = await post(doFetch, url, { method: "GET" });
      if (err) errors.push(`${number.slice(-4)}: ${err}`);
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, error: errors.join(" | ") };
}
