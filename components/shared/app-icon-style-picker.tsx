"use client";

import { AppIconStylePreview } from "@/components/shared/app-icon-style-preview";
import { useAppearance } from "@/components/shared/appearance-provider";
import { APP_ICON_STYLES } from "@/config/app-icon-styles";
import {
  SETTINGS_INSET_BLOCK,
  SETTINGS_SEGMENTED_ITEM,
  SETTINGS_SEGMENTED_ITEM_ACTIVE,
  SETTINGS_SEGMENTED_TRACK,
} from "@/config/settings-layout";
import { cn } from "@/lib/utils";

export function AppIconStylePicker() {
  const { appIconStyle, setAppIconStyle } = useAppearance();

  return (
    <div className={SETTINGS_INSET_BLOCK}>
      <div
        className={SETTINGS_SEGMENTED_TRACK}
        role="group"
        aria-label="App icon style"
      >
        {APP_ICON_STYLES.map((style) => {
          const selected = appIconStyle === style.id;

          return (
            <button
              key={style.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setAppIconStyle(style.id)}
              className={cn(
                SETTINGS_SEGMENTED_ITEM,
                "gap-1.5 py-2",
                selected
                  ? SETTINGS_SEGMENTED_ITEM_ACTIVE
                  : "text-muted-foreground",
              )}
            >
              <AppIconStylePreview style={style.id} />
              {style.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
