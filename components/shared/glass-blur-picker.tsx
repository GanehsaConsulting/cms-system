"use client";

import { useAppearance } from "@/components/shared/appearance-provider";
import { Slider } from "@/components/ui/slider";
import { GLASS_BLUR_LEVELS } from "@/config/glass-blur";
import {
  DEFAULT_GLASS_FILL_TRANSPARENCY,
  GLASS_FILL_TRANSPARENCY_MAX,
  GLASS_FILL_TRANSPARENCY_MIN,
  GLASS_FILL_TRANSPARENCY_STEP,
  getGlassFillTransparencyTrackPercent,
} from "@/config/glass-fill";
import {
  SETTINGS_CONTROL_STACK,
  SETTINGS_FIELD,
  SETTINGS_FIELD_LABEL,
  SETTINGS_INSET_BLOCK,
  SETTINGS_ROW_DIVIDER,
  SETTINGS_SEGMENTED_ITEM,
  SETTINGS_SEGMENTED_ITEM_ACTIVE,
  SETTINGS_SEGMENTED_TRACK,
} from "@/config/settings-layout";
import { cn } from "@/lib/utils";

export function GlassBlurPicker() {
  const {
    glassBlurLevel,
    glassFillTransparency,
    setGlassBlurLevel,
    setGlassFillTransparency,
  } = useAppearance();

  const defaultTransparencyPercent = getGlassFillTransparencyTrackPercent(
    DEFAULT_GLASS_FILL_TRANSPARENCY,
  );

  return (
    <div className={cn(SETTINGS_INSET_BLOCK, SETTINGS_CONTROL_STACK)}>
      <fieldset className={cn(SETTINGS_SEGMENTED_TRACK, "border-0")}>
        <legend className="sr-only">Tingkat blur glass</legend>
        {GLASS_BLUR_LEVELS.map((level) => {
          const selected = glassBlurLevel === level.id;

          return (
            <button
              key={level.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setGlassBlurLevel(level.id)}
              className={cn(
                SETTINGS_SEGMENTED_ITEM,
                selected
                  ? SETTINGS_SEGMENTED_ITEM_ACTIVE
                  : "text-muted-foreground",
              )}
            >
              {level.label}
            </button>
          );
        })}
      </fieldset>

      <div
        className={cn(
          SETTINGS_FIELD,
          SETTINGS_ROW_DIVIDER,
          "border-t pt-4",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="glass-fill-transparency-slider"
            className={SETTINGS_FIELD_LABEL}
          >
            Transparansi
          </label>
          <span className="text-muted-foreground text-xs tabular-nums">
            {glassFillTransparency}%
          </span>
        </div>
        <div className="relative">
          <Slider
            id="glass-fill-transparency-slider"
            value={[glassFillTransparency]}
            onValueChange={(value) => {
              const nextValue = Array.isArray(value) ? value[0] : value;
              setGlassFillTransparency(
                nextValue ?? GLASS_FILL_TRANSPARENCY_MIN,
              );
            }}
            min={GLASS_FILL_TRANSPARENCY_MIN}
            max={GLASS_FILL_TRANSPARENCY_MAX}
            step={GLASS_FILL_TRANSPARENCY_STEP}
            aria-label="Transparansi panel glass"
          />
          <span
            aria-hidden
            title={`Default (${DEFAULT_GLASS_FILL_TRANSPARENCY}%)`}
            className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 size-1.5 rounded-full border border-background bg-muted-foreground/70 shadow-sm"
            style={{ left: `${defaultTransparencyPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Solid</span>
          <span>Default {DEFAULT_GLASS_FILL_TRANSPARENCY}%</span>
          <span>Transparan</span>
        </div>
      </div>
    </div>
  );
}
