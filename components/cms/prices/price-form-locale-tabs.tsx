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
  errorLocales?: SiteLocale[];
  onLocaleChange: (locale: SiteLocale) => void;
}

export function PriceFormLocaleTabs({
  activeLocale,
  incompleteLocales,
  errorLocales = [],
  onLocaleChange,
}: PriceFormLocaleTabsProps) {
  const otherErrorLocales = errorLocales.filter(
    (locale) => locale !== activeLocale,
  );

  return (
    <div className="space-y-2">
      <p className="font-medium text-chart-1 text-sm">Languages</p>
      <nav
        className={cn(IOS_SEGMENTED_TRACK, "max-w-md")}
        role="tablist"
        aria-label="Price plan languages"
      >
        {SITE_LOCALES.map((locale) => {
          const isActive = activeLocale === locale;
          const isIncomplete = incompleteLocales.includes(locale);
          const hasError = errorLocales.includes(locale);

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
                (isIncomplete || hasError) &&
                  !isActive &&
                  "text-destructive",
              )}
            >
              {LOCALE_TAB_LABELS[locale]}
            </button>
          );
        })}
      </nav>
      {otherErrorLocales.length > 0 ? (
        <p className="text-destructive text-xs">
          Fix validation errors in{" "}
          {otherErrorLocales
            .map((locale) => LOCALE_TAB_LABELS[locale])
            .join(", ")}
          .
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">
          Service, package name, WhatsApp message, and features are required in
          all languages. The WhatsApp number is shared.
        </p>
      )}
    </div>
  );
}
