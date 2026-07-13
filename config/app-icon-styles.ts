import type { AppIconStyle } from "@/types/appearance";

export const DEFAULT_APP_ICON_STYLE: AppIconStyle = "colored";

export const APP_ICON_STYLES: { id: AppIconStyle; label: string }[] = [
  { id: "colored", label: "Colored" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export const APP_ICON_STYLE_IDS = new Set<AppIconStyle>(
  APP_ICON_STYLES.map((style) => style.id),
);

export function isAppIconStyle(value: string): value is AppIconStyle {
  return APP_ICON_STYLE_IDS.has(value as AppIconStyle);
}

export function normalizeAppIconStyle(value: string): AppIconStyle {
  if (isAppIconStyle(value)) {
    return value;
  }

  return DEFAULT_APP_ICON_STYLE;
}
