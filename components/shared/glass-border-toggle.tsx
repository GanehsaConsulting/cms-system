"use client";

import { useAppearance } from "@/components/shared/appearance-provider";
import { Switch } from "@/components/ui/switch";
import {
  SETTINGS_FIELD_LABEL,
  SETTINGS_ROW_DIVIDER,
} from "@/config/settings-layout";
import { cn } from "@/lib/utils";

export function GlassBorderToggle() {
  const { glassBorderEnabled, setGlassBorderEnabled } = useAppearance();

  return (
    <div
      className={cn(
        SETTINGS_ROW_DIVIDER,
        "flex items-center justify-between gap-3 border-t pt-4",
      )}
    >
      <label htmlFor="glass-border-toggle" className={SETTINGS_FIELD_LABEL}>
        Border
      </label>
      <Switch
        id="glass-border-toggle"
        checked={glassBorderEnabled}
        onCheckedChange={(checked) => setGlassBorderEnabled(checked === true)}
        aria-label="Glass border"
      />
    </div>
  );
}
