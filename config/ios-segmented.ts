/**
 * iOS segmented control — track + nested item radius.
 * Keep in sync with Appearance / System Settings pickers.
 *
 * Light: subtle neutral track on glass; opaque white active pill.
 * Dark: translucent track + elevated active segment.
 */

/** Outer track — inner radius = track radius minus p-1 (0.25rem). */
export const IOS_SEGMENTED_TRACK =
  "flex w-full rounded-[var(--radius-deep)] bg-[rgb(120_120_128/0.12)] p-1 dark:bg-white/8";

/** Text-only segment (articles filter, panel tabs). */
export const IOS_SEGMENTED_ITEM =
  "flex min-h-8 flex-1 items-center justify-center gap-1.5 rounded-[calc(var(--radius-deep)-0.25rem)] px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-all";

/** Icon + label segment (theme mode, glass blur). */
export const IOS_SEGMENTED_ITEM_STACKED =
  "flex min-h-9 flex-1 flex-col items-center justify-center gap-1 rounded-[calc(var(--radius-deep)-0.25rem)] px-1 py-1.5 text-[11px] font-medium transition-all";

export const IOS_SEGMENTED_ITEM_ACTIVE =
  "bg-white text-foreground shadow-sm ring-1 ring-black/[0.06] dark:bg-white/16 dark:text-foreground dark:shadow-none dark:ring-0";

export const IOS_SEGMENTED_ITEM_INACTIVE = "text-muted-foreground";
