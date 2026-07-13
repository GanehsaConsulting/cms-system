/**
 * macOS / Apple HIG semantic colors — keep in sync with globals.css.
 *
 * mutedForeground bumped for readability on glass UI (see `.glass-backdrop` overrides).
 */

export const MACOS_UI_LIGHT = {
  background: "#f2f2f7",
  foreground: "#1c1c1e",
  card: "#ffffff",
  secondary: "#ffffff",
  muted: "#e5e5ea",
  mutedForeground: "#48484a",
  mutedForegroundGlass: "#3a3a3c",
  separator: "rgb(60 60 67 / 0.18)",
  glassFillRgb: "248 248 248",
  glassFillOpacity: 0.65,
} as const;

export const MACOS_UI_DARK = {
  background: "#000000",
  foreground: "#ffffff",
  card: "#1c1c1e",
  secondary: "#3a3a3c",
  muted: "#2c2c2e",
  tertiary: "#3a3a3c",
  mutedForeground: "#c7c7cc",
  mutedForegroundGlass: "#e5e5ea",
  separator: "rgb(255 255 255 / 0.1)",
  glassFillRgb: "44 44 46",
  glassFillOpacity: 0.72,
} as const;
