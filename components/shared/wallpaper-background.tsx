"use client";

import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { getWallpaperLayerStyle } from "@/lib/wallpaper/resolve-wallpaper";
import { cn } from "@/lib/utils";

export function WallpaperBackground() {
  const { wallpaper, maskOpacity, maskColor } = useWallpaper();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0 transition-[background-color,background-image] duration-500 ease-out"
        style={getWallpaperLayerStyle(wallpaper)}
      />
      {maskOpacity > 0 ? (
        <div
          className={cn(
            maskColor === "black" ? "bg-black" : "bg-white",
            "absolute inset-0 transition-opacity duration-300",
          )}
          style={{ opacity: maskOpacity / 100 }}
        />
      ) : null}
    </div>
  );
}
