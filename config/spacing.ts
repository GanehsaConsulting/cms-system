/** Desktop-only viewport inset for the main content column. */
export const DESKTOP_OUTER_GUTTER = "md:py-3 md:pr-3";

/** Flex child that participates in viewport-bound scroll chains. */
export const CMS_FLEX_CHILD = "min-h-0 flex-1";

/** Scrollable region inside a constrained CMS shell. */
export const CMS_SCROLL_REGION = "min-h-0 flex-1 overflow-auto";

/** Gap between major layout columns. */
export const APP_GAP = "gap-3";

/** Inner padding inside glass shells. */
export const SHELL_PADDING = "p-3";

/** Body under a section layout header (title/tabs already padded). */
export const SECTION_BODY_PADDING = "px-3 pb-3";

/** Top padding for page body below a fixed header. */
export const CMS_PAGE_BODY_TOP_PADDING = "pt-3";

/**
 * Scroll body mask — fully opaque (no fade) when at scroll top.
 */
export const CMS_PAGE_BODY_SCROLL_MASK_NONE =
  "[mask-image:linear-gradient(to_bottom,black_0px,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0px,black_100%)]";

/**
 * Soft opacity fade on scroll body — content eases in at the top edge when scrolled.
 */
export const CMS_PAGE_BODY_SCROLL_MASK =
  "[mask-image:linear-gradient(to_bottom,transparent_0px,black_2rem)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0px,black_2rem)]";

/** Transition for scroll mask on/off. */
export const CMS_PAGE_BODY_SCROLL_MASK_TRANSITION =
  "transition-[mask-image,-webkit-mask-image] duration-300";

/** Vertical stack spacing inside panels. */
export const STACK_GAP = "gap-3";

/** Grid spacing for tiles and cards. */
export const GRID_GAP = "gap-2.5";
