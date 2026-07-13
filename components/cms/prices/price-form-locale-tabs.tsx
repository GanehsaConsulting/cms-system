"use client";

import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import { LOCALE_TAB_LABELS, SITE_LOCALES } from "@/lib/locale";
import type { SiteLocale } from "@/types/locale";
import { cn } from "@/lib/utils";

interface PriceFormLocaleTabsProps {
  activeLocale: SiteLocale;
  incompleteLocales: SiteLocale[];
  onLocaleChange: (locale: SiteLocale) => void;
}

export function PriceFormLocaleTabs({
  activeLocale,
  incompleteLocales,
  onLocaleChange,
}: PriceFormLocaleTabsProps) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-sm">Languages</p>
      <nav
        className={cn(IOS_SEGMENTED_TRACK, "max-w-md")}
        role="tablist"
        aria-label="Price plan languages"
      >
        {SITE_LOCALES.map((locale) => {
          const isActive = activeLocale === locale;
          const isIncomplete = incompleteLocales.includes(locale);

          return (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onLocaleChange(locale)}
              className={cn(
                IOS_SEGMENTED_ITEM,
                isActive
                  ? IOS_SEGMENTED_ITEM_ACTIVE
                  : IOS_SEGMENTED_ITEM_INACTIVE,
                isIncomplete && !isActive && "text-destructive",
              )}
            >
              {LOCALE_TAB_LABELS[locale]}
            </button>
          );
        })}
      </nav>
      <p className="text-muted-foreground text-xs">
        Service, package name, WhatsApp link, and features are required in all
        languages.
      </p>
    </div>
  );
}
