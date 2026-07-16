import { RADIUS_DEEP } from "@/config/shape";
import { GLASS_SURFACE } from "./glass";

/** Shared list toolbar layout and control styling. */

export const LIST_TOOLBAR_CLASS =
  "flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end";

/**
 * Soft fill control — same surface as sidebar search trigger.
 * Use for list search, filter, and secondary toolbar buttons.
 */
export const LIST_TOOLBAR_CONTROL_SURFACE = [
  RADIUS_DEEP, GLASS_SURFACE,
  "border-0! shadow-none transition-colors",
  "hover:bg-black/8",
  "dark:shadow-none dark:hover:bg-white/12",
].join(" ");

export const LIST_TOOLBAR_CONTROL_HEIGHT = "h-8";

export const LIST_TOOLBAR_CONTROL_FOCUS =
  "focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** Secondary toolbar button (Filter, Categories, options). */
export const LIST_TOOLBAR_BUTTON_CLASS = [
  LIST_TOOLBAR_CONTROL_HEIGHT,
  LIST_TOOLBAR_CONTROL_SURFACE,
  LIST_TOOLBAR_CONTROL_FOCUS,
  "gap-1.5 px-2.5 text-muted-foreground hover:bg-black/8 hover:text-foreground",
  "aria-expanded:bg-black/8 aria-expanded:text-foreground",
  "dark:hover:bg-white/12 dark:aria-expanded:bg-white/12",
].join(" ");

/** Icon-only toolbar control (⋯ menu). */
export const LIST_TOOLBAR_ICON_BUTTON_CLASS = [
  LIST_TOOLBAR_CONTROL_SURFACE,
  LIST_TOOLBAR_CONTROL_FOCUS,
  "size-8 text-muted-foreground hover:bg-black/8 hover:text-foreground",
  "aria-expanded:bg-black/8 aria-expanded:text-foreground",
  "dark:hover:bg-white/12 dark:aria-expanded:bg-white/12",
].join(" ");

export const LIST_FILTER_POPOVER_CLASS = "w-80";

export const LIST_FILTER_FIELDS_CLASS = "space-y-4";

export const LIST_FILTER_FIELD_CLASS = "space-y-2";

export const LIST_SEARCH_WRAP_CLASS = [
  "relative min-w-[12rem] flex-1 sm:w-60 sm:flex-none",
  LIST_TOOLBAR_CONTROL_HEIGHT,
  LIST_TOOLBAR_CONTROL_SURFACE,
].join(" ");

/** Compact segmented control — matches toolbar button height (h-8). */
export const LIST_TOOLBAR_SEGMENTED_TRACK = [
  LIST_TOOLBAR_CONTROL_SURFACE,
  LIST_TOOLBAR_CONTROL_HEIGHT,
  "flex w-auto shrink-0 items-center p-0.5",
].join(" ");

export const LIST_TOOLBAR_SEGMENTED_ITEM =
  "flex h-7 min-w-16 items-center justify-center gap-1.5 rounded-[calc(var(--radius-deep)-0.125rem)] px-2 text-xs font-medium whitespace-nowrap transition-all";

export const LIST_TOOLBAR_SEGMENTED_ITEM_ACTIVE =
  "bg-background text-foreground shadow-sm ring-1 ring-black/[0.06] dark:bg-white/14 dark:text-foreground dark:shadow-none dark:ring-0";

export const LIST_TOOLBAR_SEGMENTED_ITEM_INACTIVE =
  "text-muted-foreground hover:text-foreground";

export const LIST_SEARCH_INPUT_CLASS = [
  LIST_TOOLBAR_CONTROL_HEIGHT,
  LIST_TOOLBAR_CONTROL_FOCUS,
  "border-0 bg-transparent pl-8 shadow-none",
  "placeholder:text-muted-foreground",
  "dark:bg-transparent",
].join(" ");

export const LIST_SEARCH_SHORTCUT_CLASS =
  "-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 hidden rounded-md bg-black/5 px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground sm:inline dark:bg-white/10";
