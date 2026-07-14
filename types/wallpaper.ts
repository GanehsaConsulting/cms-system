export type WallpaperId =
  | "default"
  | "solid"
  | "aurora"
  | "sunset"
  | "ocean"
  | "forest"
  | "midnight"
  | "rose"
  | "custom-1"
  | "custom-2"
  | "custom-3"
  | "custom";

export type WallpaperKind = "gradient" | "image" | "solid";

export type WallpaperMaskColor = "black" | "white";

export interface WallpaperThemeVariant {
  preview: string;
  background: string;
}

export interface Wallpaper {
  id: WallpaperId;
  label: string;
  preview: string;
  background: string;
  kind: WallpaperKind;
  /** When set, preview/background swap with light/dark theme. */
  themeVariants?: {
    light: WallpaperThemeVariant;
    dark: WallpaperThemeVariant;
  };
}
