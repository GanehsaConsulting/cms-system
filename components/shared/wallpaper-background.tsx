"use client";

import { useLayoutEffect } from "react";
import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { paintWallpaperBootLayer } from "@/lib/wallpaper/apply-wallpaper-paint";

/**
 * Keeps the boot wallpaper layer in sync after hydration.
 * Does not render its own layer — that would flash the default before storage loads.
 */
export function WallpaperBackground() {
  const { wallpaper, maskOpacity, maskColor, isReady } = useWallpaper();

  useLayoutEffect(() => {
    if (!isReady) {
      return;
    }

    paintWallpaperBootLayer({
      wallpaper,
      maskOpacity,
      maskColor,
    });
  }, [isReady, maskColor, maskOpacity, wallpaper]);

  return null;
}
