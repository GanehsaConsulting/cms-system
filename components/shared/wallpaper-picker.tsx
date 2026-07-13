import { WallpaperGrid } from "@/components/shared/wallpaper-grid";
import { WallpaperMaskSlider } from "@/components/shared/wallpaper-mask-slider";
import { WallpaperUpload } from "@/components/shared/wallpaper-upload";
import { WallpaperUrlImport } from "@/components/shared/wallpaper-url-import";
import { WALLPAPER_GRID_WRAPPER } from "@/config/settings-layout";
import { cn } from "@/lib/utils";

export function WallpaperPicker() {
  return (
    <div className="flex flex-col">
      <WallpaperUpload />
      <WallpaperUrlImport />
      <WallpaperMaskSlider />
      <div className={cn(WALLPAPER_GRID_WRAPPER)}>
        <WallpaperGrid />
      </div>
    </div>
  );
}
