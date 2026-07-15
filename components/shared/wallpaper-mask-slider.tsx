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
  const { wallpaper, maskOpacity, setMaskOpacity } = useWallpaper();

  if (wallpaper.kind === "solid") {
    return null;
  }

  return (
    <div
      className={cn(
        SETTINGS_INSET_BLOCK,
        SETTINGS_ROW_DIVIDER,
        SETTINGS_CONTROL_STACK,
        "border-t",
      )}
    >
      <div className={SETTINGS_FIELD}>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="wallpaper-mask-slider"
            className={SETTINGS_FIELD_LABEL}
          >
            Accessibility mask
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
          aria-label="Wallpaper mask strength for readability"
        />
        <p className={SETTINGS_FIELD_HINT}>
          Raise if text or UI is hard to read over the wallpaper.
        </p>
      </div>

      <div className={SETTINGS_FIELD}>
        <span className={SETTINGS_SUBFIELD_LABEL}>Mask color</span>
        <WallpaperMaskColorPicker />
      </div>
    </div>
  );
}
