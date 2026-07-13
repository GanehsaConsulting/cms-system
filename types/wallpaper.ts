export type WallpaperId =
  | "default"
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

export type WallpaperKind = "gradient" | "image";

export type WallpaperMaskColor = "black" | "white";

export interface Wallpaper {
  id: WallpaperId;
  label: string;
  preview: string;
  background: string;
  kind: WallpaperKind;
}
