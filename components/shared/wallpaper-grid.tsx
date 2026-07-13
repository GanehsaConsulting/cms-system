"use client";

import { WallpaperOption } from "@/components/shared/wallpaper-option";
import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { WALLPAPER_GRID_GAP } from "@/config/settings-layout";
import { WALLPAPERS } from "@/config/wallpapers";
import { listFilledCustomWallpaperSlots } from "@/lib/wallpaper/custom-wallpaper";
import { resolveCustomWallpaper } from "@/lib/wallpaper/resolve-wallpaper";
import { cn } from "@/lib/utils";

export function WallpaperGrid() {
  const {
    wallpaperId,
    customWallpaperSlots,
    setWallpaperId,
    removeCustomWallpaper,
  } = useWallpaper();
  const customWallpapers = listFilledCustomWallpaperSlots(customWallpaperSlots);

  return (
    <div className={cn("grid grid-cols-2", WALLPAPER_GRID_GAP)}>
      {customWallpapers.map(({ slot, url }) => {
        const wallpaper = resolveCustomWallpaper(url, slot);

        return (
          <WallpaperOption
            key={wallpaper.id}
            wallpaper={wallpaper}
            selected={wallpaperId === wallpaper.id}
            onSelect={setWallpaperId}
            onRemove={() => removeCustomWallpaper(slot)}
          />
        );
      })}
      {WALLPAPERS.map((wallpaper) => (
        <WallpaperOption
          key={wallpaper.id}
          wallpaper={wallpaper}
          selected={wallpaperId === wallpaper.id}
          onSelect={setWallpaperId}
        />
      ))}
    </div>
  );
}
