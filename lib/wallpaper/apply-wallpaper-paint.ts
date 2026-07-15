import type { CSSProperties } from "react";
import {
  WALLPAPER_BOOT_LAYER_ID,
  WALLPAPER_BOOT_MASK_ID,
} from "@/lib/wallpaper/paint-cache";
import { getWallpaperBackgroundStyle } from "@/lib/wallpaper/resolve-wallpaper";
import type { Wallpaper, WallpaperMaskColor } from "@/types/wallpaper";

function applyCssProperties(element: HTMLElement, styles: CSSProperties): void {
  element.style.background = "";
  element.style.backgroundColor = "";
  element.style.backgroundImage = "";
  element.style.backgroundSize = "";
  element.style.backgroundPosition = "";
  element.style.backgroundRepeat = "";

  for (const [key, value] of Object.entries(styles)) {
    if (value == null || value === "") {
      continue;
    }

    const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    element.style.setProperty(cssKey, String(value));
  }
}

export function paintWallpaperBootLayer(input: {
  wallpaper: Pick<Wallpaper, "kind" | "background">;
  maskOpacity: number;
  maskColor: WallpaperMaskColor;
}): void {
  if (typeof document === "undefined") {
    return;
  }

  const layer = document.getElementById(WALLPAPER_BOOT_LAYER_ID);
  const mask = document.getElementById(WALLPAPER_BOOT_MASK_ID);

  if (!layer) {
    return;
  }

  applyCssProperties(
    layer,
    getWallpaperBackgroundStyle(input.wallpaper as Wallpaper),
  );

  if (!mask) {
    return;
  }

  const showMask = input.wallpaper.kind !== "solid" && input.maskOpacity > 0;
  mask.style.opacity = showMask ? String(input.maskOpacity / 100) : "0";
  mask.style.backgroundColor =
    input.maskColor === "white" ? "rgb(255 255 255)" : "rgb(0 0 0)";
}
