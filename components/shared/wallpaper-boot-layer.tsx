import {
  WALLPAPER_BOOT_LAYER_ID,
  WALLPAPER_BOOT_MASK_ID,
} from "@/lib/wallpaper/paint-cache";

/**
 * Fixed layers painted by the blocking bootstrap script before React hydrates.
 * WallpaperBackground keeps these in sync after load — do not remove on remount.
 */
export function WallpaperBootLayer() {
  return (
    <>
      <div
        id={WALLPAPER_BOOT_LAYER_ID}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 transition-[background-color,background-image] duration-500 ease-out"
      />
      <div
        id={WALLPAPER_BOOT_MASK_ID}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
    </>
  );
}
