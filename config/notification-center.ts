import { MODAL_PANEL_SURFACE } from "@/config/glass";
import { RADIUS_OUTER } from "@/config/shape";

/** Floating right panel — same frosted surface as Dialog. */
export const NOTIFICATION_CENTER_SURFACE = [
  "notification-center-drawer",
  RADIUS_OUTER,
  MODAL_PANEL_SURFACE,
  "inset-y-3! right-3! left-auto! h-auto! w-[min(24rem,calc(100vw-1.5rem))]! max-w-none! sm:max-w-none!",
  "flex flex-col gap-0 overflow-hidden border-0! p-0",
].join(" ");

export const NOTIFICATION_CARD_SURFACE =
  "rounded-[1.15rem] bg-white/55 p-3 dark:bg-white/10";

export const NOTIFICATION_WIDGET_SURFACE =
  "rounded-[1.35rem] bg-white/55 p-3 dark:bg-white/10";

export const NOTIFICATION_PILL_BUTTON =
  "h-8 rounded-full bg-white/45 px-4 text-xs font-medium text-foreground hover:bg-white/60 dark:bg-white/12 dark:hover:bg-white/18";
