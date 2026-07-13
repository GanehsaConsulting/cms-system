export type ThemeMode = "light" | "dark" | "system";

export type AppIconStyle = "colored" | "light" | "dark";

export type AccentColorId =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "graphite";

export interface AppearanceSettings {
  themeMode: ThemeMode;
  accentId: AccentColorId;
  appIconStyle: AppIconStyle;
}
