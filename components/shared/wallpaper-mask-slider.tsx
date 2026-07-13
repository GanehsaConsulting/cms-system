"use client";

import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { WallpaperMaskColorPicker } from "@/components/shared/wallpaper-mask-color-picker";
import { Slider } from "@/components/ui/slider";
import {
  WALLPAPER_MASK_MAX,
  WALLPAPER_MASK_MIN,
  WALLPAPER_MASK_STEP,
} from "@/config/wallpaper-mask";
import {
  SETTINGS_CONTROL_STACK,
  SETTINGS_FIELD,
  SETTINGS_FIELD_HINT,
  SETTINGS_FIELD_LABEL,
  SETTINGS_INSET_BLOCK,
  SETTINGS_ROW_DIVIDER,
  SETTINGS_SUBFIELD_LABEL,
} from "@/config/settings-layout";
import { cn } from "@/lib/utils";

export function WallpaperMaskSlider() {
  const { maskOpacity, setMaskOpacity, wallpaperId } = useWallpaper();
  const isDefaultWallpaper = wallpaperId === "default";

  return (
    <div
      className={cn(
        SETTINGS_INSET_BLOCK,
        SETTINGS_ROW_DIVIDER,
        SETTINGS_CONTROL_STACK,
        "border-t",
        isDefaultWallpaper && "opacity-70",
      )}
    >
      <div className={SETTINGS_FIELD}>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="wallpaper-mask-slider"
            className={SETTINGS_FIELD_LABEL}
          >
            Mask aksesibilitas
          </label>
          <span className="text-muted-foreground text-xs tabular-nums">
            {maskOpacity}%
          </span>
        </div>
        <Slider
          id="wallpaper-mask-slider"
          value={[maskOpacity]}
          onValueChange={(value) => {
            const nextValue = Array.isArray(value) ? value[0] : value;
            setMaskOpacity(nextValue ?? WALLPAPER_MASK_MIN);
          }}
          min={WALLPAPER_MASK_MIN}
          max={WALLPAPER_MASK_MAX}
          step={WALLPAPER_MASK_STEP}
          disabled={isDefaultWallpaper}
          aria-label="Tingkat mask wallpaper untuk keterbacaan"
        />
        <p className={SETTINGS_FIELD_HINT}>
          {isDefaultWallpaper
            ? "Pilih wallpaper selain Default untuk menyesuaikan overlay."
            : "Naikkan jika teks atau UI sulit dibaca di atas wallpaper."}
        </p>
      </div>

      <div className={SETTINGS_FIELD}>
        <span className={SETTINGS_SUBFIELD_LABEL}>Warna mask</span>
        <WallpaperMaskColorPicker disabled={isDefaultWallpaper} />
      </div>
    </div>
  );
}
