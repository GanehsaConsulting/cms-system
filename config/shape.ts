/**
 * Radius hierarchy — keep in sync with globals.css (--radius-outer/inner/deep).
 *
 * L1 Outer  — page shell, sidebar glass (GlassPanel, app-sidebar inner)
 * L2 Inner  — cards, tiles, tables, editor shell inside a shell
 * L3 Deep   — nav items, icon wells, alerts, compact controls
 */

export const RADIUS_OUTER = "rounded-[var(--radius-outer)]";
export const RADIUS_INNER = "rounded-[var(--radius-inner)]";
export const RADIUS_DEEP = "rounded-[var(--radius-deep)]";

/** @alias RADIUS_OUTER */
export const SEPARATED_SHELL = RADIUS_OUTER;

/** @alias RADIUS_INNER */
export const SEPARATED_SURFACE = RADIUS_INNER;

/** @alias RADIUS_DEEP */
export const SEPARATED_CONTROL = RADIUS_DEEP;

/** Icon / avatar wells inside shells. */
export const RADIUS_ICON_WELL = RADIUS_DEEP;

export const SEPARATED_PILL = "rounded-full";
