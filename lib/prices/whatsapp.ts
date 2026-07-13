import { WHATSAPP_PHONE_LIMITS } from "@/config/whatsapp";

/** Digits only — country code without + (e.g. 628887127000). */
export function normalizeWhatsAppPhone(raw: string) {
  return raw.replace(/\D/g, "");
}

export function isValidWhatsAppPhone(phone: string) {
  const digits = normalizeWhatsAppPhone(phone);
  return (
    digits.length >= WHATSAPP_PHONE_LIMITS.minDigits &&
    digits.length <= WHATSAPP_PHONE_LIMITS.maxDigits
  );
}

/** Pull phone digits from a raw number or legacy wa.me / api.whatsapp.com URL. */
export function extractWhatsAppPhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);
    const phoneParam = url.searchParams.get("phone");
    if (phoneParam) {
      return normalizeWhatsAppPhone(phoneParam);
    }

    const pathMatch = url.pathname.match(/\/(?:send\/?)?(\d{8,15})/);
    if (pathMatch?.[1]) {
      return pathMatch[1];
    }
  } catch {
    // Not a URL — fall through to digit strip.
  }

  return normalizeWhatsAppPhone(trimmed);
}

export function extractWhatsAppMessage(value: string) {
  try {
    const url = new URL(value.trim());
    return url.searchParams.get("text")?.trim() ?? "";
  } catch {
    return "";
  }
}

/**
 * Builds a public WhatsApp deep link, e.g.
 * https://api.whatsapp.com/send/?phone=628887127000&text=...&type=phone_number&app_absent=0
 */
export function buildWhatsAppUrl(phone: string, text: string) {
  const digits = normalizeWhatsAppPhone(phone);
  if (!digits) {
    return "";
  }

  const params = new URLSearchParams({
    phone: digits,
    type: "phone_number",
    app_absent: "0",
  });

  if (text.trim()) {
    params.set("text", text.trim());
  }

  return `https://api.whatsapp.com/send/?${params.toString()}`;
}
