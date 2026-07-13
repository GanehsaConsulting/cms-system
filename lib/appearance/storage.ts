import {
  DEFAULT_ACCENT_ID,
  normalizeAccentId,
} from "@/config/accent-colors";
import {
  DEFAULT_APP_ICON_STYLE,
  isAppIconStyle,
  normalizeAppIconStyle,
} from "@/config/app-icon-styles";
import { DEFAULT_THEME_MODE, THEME_MODE_IDS } from "@/config/theme-modes";
import {
  writeClientAccentCookie,
  writeClientThemeCookie,
} from "@/lib/appearance/cookies";
import type {
  AccentColorId,
  AppIconStyle,
  ThemeMode,
} from "@/types/appearance";

const THEME_STORAGE_KEY = "cms:theme";
const ACCENT_STORAGE_KEY = "cms:accent";
const APP_ICON_STYLE_STORAGE_KEY = "cms:app-icon-style";

export function isThemeMode(value: string): value is ThemeMode {
  return THEME_MODE_IDS.has(value as ThemeMode);
}

export function readStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_MODE;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (!stored || !isThemeMode(stored)) {
    return DEFAULT_THEME_MODE;
  }

  return stored;
}

export function readStoredAccentId(): AccentColorId {
  if (typeof window === "undefined") {
    return DEFAULT_ACCENT_ID;
  }

  const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY);
  if (!stored) {
    return DEFAULT_ACCENT_ID;
  }

  return normalizeAccentId(stored);
}

export function writeStoredThemeMode(mode: ThemeMode): void {
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  writeClientThemeCookie(mode);
}

export function writeStoredAccentId(id: AccentColorId): void {
  window.localStorage.setItem(ACCENT_STORAGE_KEY, id);
  writeClientAccentCookie(id);
}

export function readStoredAppIconStyle(): AppIconStyle {
  if (typeof window === "undefined") {
    return DEFAULT_APP_ICON_STYLE;
  }

  const stored = window.localStorage.getItem(APP_ICON_STYLE_STORAGE_KEY);
  if (!stored || !isAppIconStyle(stored)) {
    return DEFAULT_APP_ICON_STYLE;
  }

  return normalizeAppIconStyle(stored);
}

export function writeStoredAppIconStyle(style: AppIconStyle): void {
  window.localStorage.setItem(APP_ICON_STYLE_STORAGE_KEY, style);
}
