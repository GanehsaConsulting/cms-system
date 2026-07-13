/** iOS system gray glass — not pure white/black. Keep in sync with globals.css. */
export const GLASS_FILL_RGB_LIGHT = "248 248 248";
export const GLASS_FILL_RGB_DARK = "44 44 46";
export const GLASS_FILL_LIGHT_DEFAULT = "#F8F8F8C5";
export const GLASS_FILL_DARK_DEFAULT = "#2C2C2EB8";

/** Backdrop filters — blur via CSS var (--glass-backdrop-blur). */
export const GLASS_BACKDROP = "glass-backdrop";

/** Frosted fill — uses CSS var. */
export const GLASS_FILL = "bg-[var(--glass-fill)]";

export const GLASS_BORDER = "border border-black/12 dark:border-white/12";

export const GLASS_HIGHLIGHT =
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.26),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_1px_3px_rgba(0,0,0,0.18)]";

export const GLASS_SURFACE = `${GLASS_BACKDROP} ${GLASS_BORDER} ${GLASS_FILL} ${GLASS_HIGHLIGHT}`;

/**
 * Modal / drawer panel — same frosted look (blur-3xl).
 * Prefer this over GLASS_SURFACE for overlays that should match Dialog.
 */
export const MODAL_PANEL_SURFACE = [
  "backdrop-blur-3xl",
  GLASS_FILL,
  "shadow-[0_4px_16px_rgb(0_0_0/0.08),0_1px_4px_rgb(0_0_0/0.03)] ring-1 ring-white/50",
  "dark:shadow-[0_8px_28px_rgb(0_0_0/0.36),0_1px_5px_rgb(0_0_0/0.16)] dark:ring-white/10",
].join(" ");

/** Hover/active overlay on glass controls — tinted from glass base, not pure white. */
export const GLASS_HOVER =
  "hover:bg-[rgb(var(--glass-fill-rgb)/0.85)] dark:hover:bg-[rgb(var(--glass-fill-rgb)/0.72)] dark:active:bg-[rgb(var(--glass-fill-rgb)/0.8)]";

export const GLASS_TILE_HIGHLIGHT =
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]";

export const GLASS_TILE_BASE = `${GLASS_BACKDROP} ${GLASS_TILE_HIGHLIGHT}`;

/** iOS-style hairline outline for large glass shells (sidebar). */
export const GLASS_SHELL_OUTLINE = `${GLASS_BACKDROP} ${GLASS_BORDER} ${GLASS_HIGHLIGHT}`;
