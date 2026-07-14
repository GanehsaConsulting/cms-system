import type { CSSProperties } from "react";
import { DEFAULT_WALLPAPER_ID, WALLPAPERS } from "@/config/wallpapers";
import {
  type CustomWallpaperSlots,
  customWallpaperIdForSlot,
  isCustomWallpaperId,
  LEGACY_CUSTOM_WALLPAPER_ID,
  normalizeStoredWallpaperId,
  slotForCustomWallpaperId,
} from "@/lib/wallpaper/custom-wallpaper";
import type { Wallpaper, WallpaperId } from "@/types/wallpaper";

export function resolveWallpaper(id: WallpaperId): Wallpaper {
  return WALLPAPERS.find((wallpaper) => wallpaper.id === id) ?? WALLPAPERS[0];
}

/** Apply light/dark image variants when the wallpaper defines them. */
export function applyWallpaperTheme(
  wallpaper: Wallpaper,
  isDark: boolean,
): Wallpaper {
  if (!wallpaper.themeVariants) {
    return wallpaper;
  }

  const variant = isDark
    ? wallpaper.themeVariants.dark
    : wallpaper.themeVariants.light;

  return {
    ...wallpaper,
    preview: variant.preview,
    background: variant.background,
  };
}

export function resolveCustomWallpaper(
  imageUrl: string,
  slot: number,
): Wallpaper {
  return {
    id: customWallpaperIdForSlot(slot),
    label: `Custom ${slot + 1}`,
    preview: imageUrl,
    background: imageUrl,
    kind: "image",
  };
}

export function resolveActiveWallpaper(
  id: WallpaperId,
  customWallpaperSlots: CustomWallpaperSlots,
  isDark = false,
): Wallpaper {
  const normalizedId = normalizeStoredWallpaperId(id) as WallpaperId;
  const slot = slotForCustomWallpaperId(normalizedId);

  if (slot !== null) {
    const imageUrl = customWallpaperSlots[slot];
    if (imageUrl) {
      return resolveCustomWallpaper(imageUrl, slot);
    }

    return applyWallpaperTheme(resolveWallpaper(DEFAULT_WALLPAPER_ID), isDark);
  }

  return applyWallpaperTheme(resolveWallpaper(normalizedId), isDark);
}

export function isActiveCustomWallpaper(
  id: WallpaperId,
  customWallpaperSlots: CustomWallpaperSlots,
): boolean {
  const slot = slotForCustomWallpaperId(normalizeStoredWallpaperId(id));
  return slot !== null && customWallpaperSlots[slot] !== null;
}

const WALLPAPER_FILL: CSSProperties = {
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const GRADIENT_BACKGROUND_COLOR_SUFFIX = ", var(--background)";

function getGradientWallpaperStyle(background: string): CSSProperties {
  if (background === "var(--background)") {
    return { backgroundColor: background };
  }

  if (background.endsWith(GRADIENT_BACKGROUND_COLOR_SUFFIX)) {
    return {
      backgroundColor: "var(--background)",
      backgroundImage: background.slice(
        0,
        -GRADIENT_BACKGROUND_COLOR_SUFFIX.length,
      ),
      ...WALLPAPER_FILL,
    };
  }

  return {
    backgroundImage: background,
    ...WALLPAPER_FILL,
  };
}

export function getWallpaperBackgroundStyle(
  wallpaper: Wallpaper,
): CSSProperties {
  if (wallpaper.kind === "solid") {
    return { backgroundColor: wallpaper.background };
  }

  if (wallpaper.kind === "image") {
    return {
      backgroundColor: "var(--background)",
      backgroundImage: `url("${wallpaper.background}")`,
      ...WALLPAPER_FILL,
    };
  }

  return getGradientWallpaperStyle(wallpaper.background);
}

export function getWallpaperLayerStyle(wallpaper: Wallpaper): CSSProperties {
  return getWallpaperBackgroundStyle(wallpaper);
}

export function getWallpaperPreviewStyle(
  wallpaper: Pick<Wallpaper, "kind" | "preview">,
): CSSProperties {
  if (wallpaper.kind === "solid") {
    return { backgroundColor: wallpaper.preview };
  }

  if (wallpaper.kind === "image") {
    return {
      backgroundImage: `url("${wallpaper.preview}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return getGradientWallpaperStyle(wallpaper.preview);
}

export { isCustomWallpaperId, LEGACY_CUSTOM_WALLPAPER_ID };
