import { GLASS_SURFACE } from "@/config/glass";
import { RADIUS_OUTER, SEPARATED_CONTROL } from "@/config/shape";

export const SIDEBAR_OPEN_STORAGE_KEY = "cms:sidebar-open";

export const SEPARATED_SIDEBAR_CLASS = "app-sidebar";

/** Collapsed (icon) rail width — overrides shadcn default 3rem via SidebarProvider. */
export const SEPARATED_SIDEBAR_ICON_WIDTH = "3.75rem";

/** Viewport inset for floating sidebar — synced with globals.css `.app-sidebar` padding. */
export const SEPARATED_SIDEBAR_GUTTER = "";

export const SEPARATED_SIDEBAR_RADIUS = RADIUS_OUTER;

export const SEPARATED_MENU_ITEM = SEPARATED_CONTROL;

/** Applied to `[data-slot="sidebar-inner"]` via globals.css — keep in sync with GLASS_SURFACE. */
export const SEPARATED_SIDEBAR_GLASS = GLASS_SURFACE;

/** Uniform inset inside the glass shell (top/right/bottom/left). */
export const SIDEBAR_INNER_PADDING = "0.5rem";

/** Spacing between icon rows when collapsed. */
export const SIDEBAR_COLLAPSED_ITEM_GAP = "0.375rem";

/** Dock item gap in px — keep in sync with SIDEBAR_COLLAPSED_ITEM_GAP. */
export const SIDEBAR_DOCK_ITEM_GAP_PX = 8;

/** Collapsed dock shell — synced with globals.css collapsed inner padding. */
export const SIDEBAR_CONTAINER_GUTTER = "0.75rem";
export const SIDEBAR_EXPANDED_INNER_PADDING = "1rem";
export const SIDEBAR_COLLAPSED_INNER_PADDING_Y = "0.7rem";
export const SIDEBAR_COLLAPSED_INNER_PADDING_X = "1.75rem";
export const SIDEBAR_COLLAPSED_RADIUS = "1.35rem";

/** Wrapper around SidebarCollapsedDock — centers icon column in glass pill. */
export const SIDEBAR_COLLAPSED_DOCK_WRAPPER = "flex w-full justify-center";

/** Apple-style app icon shell (collapsed sidebar). */
export const SIDEBAR_APP_ICON_SHELL =
  "flex size-9 shrink-0 items-center justify-center rounded-[0.7rem] bg-linear-to-b shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.14)]";

export const SIDEBAR_APP_ICON_GLYPH = "size-4 text-white drop-shadow-sm";

/** Soft gradients for collapsed app icons. */
export const SIDEBAR_APP_ICON_GRADIENTS = {
  brand: "from-[#7C8CFF] via-[#5B6CFF] to-[#3B4FE0]",
  overview: "from-[#5AC8FA] via-[#32ADE6] to-[#007AFF]",
  articles: "from-[#FF70C1] via-[#FF2D55] to-[#D91A45]",
  prices: "from-[#34C759] via-[#30B350] to-[#248A3D]",
  appearance: "from-[#5AC8FA] via-[#32ADE6] to-[#007AFF]",
  settings: "from-[#C7C7CC] via-[#8E8E93] to-[#636366]",
  collapse: "from-[#E5E5EA] via-[#AEAEB2] to-[#8E8E93]",
} as const;

export type SidebarAppIconGradient =
  (typeof SIDEBAR_APP_ICON_GRADIENTS)[keyof typeof SIDEBAR_APP_ICON_GRADIENTS];

/** Apple Dock magnification — peak scale at cursor. */
export const SIDEBAR_DOCK_MAX_SCALE = 1.75;

/** Distance (px) from cursor where magnification falls to 1. */
export const SIDEBAR_DOCK_INFLUENCE = 70;

/** Base icon size in px (size-9 = 36). */
export const SIDEBAR_DOCK_ICON_SIZE = 36;

export const SIDEBAR_DOCK_TRIGGER_CLASS =
  "flex size-9 items-center justify-center rounded-[0.7rem] outline-none transition-opacity  focus-visible:ring-2 focus-visible:ring-white/70";

export const SIDEBAR_DOCK_LABEL_CLASS =
  "pointer-events-none absolute top-1/2 left-[calc(100%+0.625rem)] z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md transition-opacity duration-100";

export const SIDEBAR_DOCK_ACTIVE_DOT_CLASS =
  "pointer-events-none absolute top-1/2 -right-1.75 size-1 -translate-y-1/2 rounded-full bg-white";
