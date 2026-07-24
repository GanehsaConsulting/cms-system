"use client";

import { Switch } from "@/components/ui/switch";
import { useAppearance } from "@/components/shared/appearance-provider";
import { cn } from "@/lib/utils";

interface CmsImagePickerOptimizeToggleProps {
  className?: string;
}

/** Session preference for device uploads — default ON via Appearance storage. */
export function CmsImagePickerOptimizeToggle({
  className,
}: CmsImagePickerOptimizeToggleProps) {
  const { optimizeImagesEnabled, setOptimizeImagesEnabled } = useAppearance();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-[var(--radius-inner)] bg-muted/30 px-3 py-2.5",
        className,
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <label
          htmlFor="cms-image-picker-optimize"
          className="font-medium text-sm leading-none"
        >
          Optimize before upload
        </label>
        <p className="text-muted-foreground text-[11px] leading-snug">
          Resize and convert to WebP (JPEG fallback). Applies to device uploads.
        </p>
      </div>
      <Switch
        id="cms-image-picker-optimize"
        checked={optimizeImagesEnabled}
        onCheckedChange={(checked) =>
          setOptimizeImagesEnabled(checked === true)
        }
        aria-label="Optimize images before upload"
        className="shrink-0"
      />
    </div>
  );
}
