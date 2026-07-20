/** Shared dialog widths — keep CMS modals visually consistent. */
export const DIALOG_SIZE = {
  sm: "w-[min(100vw-1.5rem,24rem)]",
  md: "w-[min(100vw-1.5rem,28rem)]",
  lg: "w-[min(100vw-1.5rem,36rem)]",
  xl: "w-[min(100vw-1.5rem,48rem)]",
  "2xl": "w-[min(100vw-1.5rem,56rem)]",
  /** Edge-to-edge viewport — pair with `fullscreen` on DialogContent. */
  full: "w-screen max-w-none",
} as const;

export type DialogSize = keyof typeof DIALOG_SIZE;

export const DIALOG_DEFAULT_SIZE: DialogSize = "md";

export const DIALOG_BODY_CLASS =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4";

/** Form wrapper inside CmsDialogContent — keeps body scrollable under header/footer. */
export const DIALOG_FORM_CLASS = "flex min-h-0 flex-1 flex-col overflow-hidden";
