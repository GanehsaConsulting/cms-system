import type {
  AccentColorId,
  AppearanceSettings,
  ThemeMode,
} from "@/types/appearance";
import { writeClientResolvedDarkCookie } from "@/lib/appearance/cookies";

export function resolveDarkMode(themeMode: ThemeMode): boolean {
  if (themeMode === "dark") {
    return true;
  }

  if (themeMode === "light") {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyAppearance({
  themeMode,
  accentId,
  appIconStyle,
}: AppearanceSettings): void {
  const root = document.documentElement;
  const resolvedDark = resolveDarkMode(themeMode);

  root.dataset.accent = accentId;
  root.dataset.appIcon = appIconStyle;
  root.classList.toggle("dark", resolvedDark);
  writeClientResolvedDarkCookie(resolvedDark);
}
