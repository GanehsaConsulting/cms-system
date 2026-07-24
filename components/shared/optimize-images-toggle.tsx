"use client";

import { useAppearance } from "@/components/shared/appearance-provider";
import { Switch } from "@/components/ui/switch";
import {
  SETTINGS_FIELD_HINT,
  SETTINGS_FIELD_LABEL,
  SETTINGS_INSET_BLOCK,
} from "@/config/settings-layout";
import { cn } from "@/lib/utils";

export function OptimizeImagesToggle() {
  const { optimizeImagesEnabled, setOptimizeImagesEnabled } = useAppearance();

  return (
    <div
      className={cn(
        SETTINGS_INSET_BLOCK,
        "flex items-start justify-between gap-3",
      )}
    >
      <div className="min-w-0 space-y-1">
        <label
          htmlFor="optimize-images-toggle"
          className={SETTINGS_FIELD_LABEL}
        >
          Optimize before upload
        </label>
        <p className={SETTINGS_FIELD_HINT}>
          Resize large images and convert to WebP (JPEG fallback). GIFs stay
          unchanged. Turn off to keep original files.
        </p>
      </div>
      <Switch
        id="optimize-images-toggle"
        checked={optimizeImagesEnabled}
        onCheckedChange={(checked) =>
          setOptimizeImagesEnabled(checked === true)
        }
        aria-label="Optimize images before upload"
        className="mt-0.5 shrink-0"
      />
    </div>
  );
}
