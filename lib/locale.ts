import type { LocalizedText, SiteLocale } from "@/types/locale";

export const SITE_LOCALES: SiteLocale[] = ["id", "en", "zh"];

export const LOCALE_TAB_LABELS: Record<SiteLocale, string> = {
  id: "ID",
  en: "EN",
  zh: "中文",
};

export function emptyLocalizedText(value = ""): LocalizedText {
  return { id: value, en: value, zh: value };
}

export function trimLocalized(text: LocalizedText): LocalizedText {
  return {
    id: text.id.trim(),
    en: text.en.trim(),
    zh: text.zh.trim(),
  };
}

export function updateLocalizedField(
  text: LocalizedText,
  locale: SiteLocale,
  value: string,
): LocalizedText {
  return { ...text, [locale]: value };
}

export function getLocalizedSearchText(text: LocalizedText): string {
  return SITE_LOCALES.map((locale) => text[locale]).join(" ");
}

export function isLocalizedTextComplete(text: LocalizedText): boolean {
  return SITE_LOCALES.every((locale) => text[locale].trim().length > 0);
}

export function isLocaleTabComplete(
  text: LocalizedText,
  locale: SiteLocale,
): boolean {
  return text[locale].trim().length > 0;
}
