import {
  WHATSAPP_PHONE_STORAGE_KEY,
  WHATSAPP_SAVED_PHONES_MAX,
} from "@/config/whatsapp";
import {
  isValidWhatsAppPhone,
  normalizeWhatsAppPhone,
} from "@/lib/prices/whatsapp";

export interface SavedWhatsAppPhone {
  id: string;
  phone: string;
  label: string;
}

function normalizeSavedPhone(value: unknown): SavedWhatsAppPhone | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const entry = value as Partial<SavedWhatsAppPhone>;
  const phone = normalizeWhatsAppPhone(String(entry.phone ?? ""));

  if (!isValidWhatsAppPhone(phone)) {
    return null;
  }

  return {
    id: typeof entry.id === "string" && entry.id ? entry.id : phone,
    phone,
    label:
      typeof entry.label === "string" && entry.label.trim()
        ? entry.label.trim()
        : phone,
  };
}

export function readSavedWhatsAppPhones(): SavedWhatsAppPhone[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WHATSAPP_PHONE_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const phones: SavedWhatsAppPhone[] = [];
    const seen = new Set<string>();

    for (const item of parsed) {
      const phone = normalizeSavedPhone(item);
      if (!phone || seen.has(phone.phone)) {
        continue;
      }
      seen.add(phone.phone);
      phones.push(phone);
      if (phones.length >= WHATSAPP_SAVED_PHONES_MAX) {
        break;
      }
    }

    return phones;
  } catch {
    return [];
  }
}

export function writeSavedWhatsAppPhones(phones: SavedWhatsAppPhone[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WHATSAPP_PHONE_STORAGE_KEY,
    JSON.stringify(phones.slice(0, WHATSAPP_SAVED_PHONES_MAX)),
  );
}

export function saveWhatsAppPhone(phone: string, label?: string) {
  const digits = normalizeWhatsAppPhone(phone);
  if (!isValidWhatsAppPhone(digits)) {
    return readSavedWhatsAppPhones();
  }

  const existing = readSavedWhatsAppPhones();
  const next: SavedWhatsAppPhone[] = [
    {
      id: digits,
      phone: digits,
      label: label?.trim() || digits,
    },
    ...existing.filter((entry) => entry.phone !== digits),
  ].slice(0, WHATSAPP_SAVED_PHONES_MAX);

  writeSavedWhatsAppPhones(next);
  return next;
}

export function removeSavedWhatsAppPhone(phone: string) {
  const digits = normalizeWhatsAppPhone(phone);
  const next = readSavedWhatsAppPhones().filter(
    (entry) => entry.phone !== digits,
  );
  writeSavedWhatsAppPhones(next);
  return next;
}
