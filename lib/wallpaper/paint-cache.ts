import type {
  Wallpaper,
  WallpaperId,
  WallpaperKind,
  WallpaperMaskColor,
} from "@/types/wallpaper";

export const WALLPAPER_PAINT_CACHE_KEY = "cms:wallpaper-paint";

export interface WallpaperPaintCache {
  id: WallpaperId;
  kind: WallpaperKind;
  /** Resolved background for light theme. */
  backgroundLight: string;
  /** Resolved background for dark theme. */
  backgroundDark: string;
  maskOpacity: number;
  maskColor: WallpaperMaskColor;
}

export function readWallpaperPaintCache(): WallpaperPaintCache | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(WALLPAPER_PAINT_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as WallpaperPaintCache;
    if (
      !parsed?.id ||
      !parsed.kind ||
      typeof parsed.backgroundLight !== "string" ||
      typeof parsed.backgroundDark !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeWallpaperPaintCache(cache: WallpaperPaintCache): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      WALLPAPER_PAINT_CACHE_KEY,
      JSON.stringify(cache),
    );
  } catch {
    // Quota exceeded (large custom wallpapers) — skip; next boot uses presets only.
  }
}

export function buildWallpaperPaintCache(input: {
  wallpaper: Wallpaper;
  lightBackground: string;
  darkBackground: string;
  maskOpacity: number;
  maskColor: WallpaperMaskColor;
}): WallpaperPaintCache {
  return {
    id: input.wallpaper.id,
    kind: input.wallpaper.kind,
    backgroundLight: input.lightBackground,
    backgroundDark: input.darkBackground,
    maskOpacity: input.maskOpacity,
    maskColor: input.maskColor,
  };
}

/** Persist resolved light/dark paints so the bootstrap script can restore them. */
export function syncWallpaperPaintCache(input: {
  id: WallpaperId;
  kind: WallpaperKind;
  lightBackground: string;
  darkBackground: string;
  maskOpacity: number;
  maskColor: WallpaperMaskColor;
}): void {
  writeWallpaperPaintCache({
    id: input.id,
    kind: input.kind,
    backgroundLight: input.lightBackground,
    backgroundDark: input.darkBackground,
    maskOpacity: input.maskOpacity,
    maskColor: input.maskColor,
  });
}

export const WALLPAPER_BOOT_LAYER_ID = "cms-wallpaper-boot-layer";
export const WALLPAPER_BOOT_MASK_ID = "cms-wallpaper-boot-mask";
