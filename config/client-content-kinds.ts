export type ClientContentKind =
  | "logo"
  | "photos"
  | "testimonials"
  | "portfolio";

export const CLIENT_CONTENT_KIND_LABELS: Record<ClientContentKind, string> = {
  logo: "Logo",
  photos: "Client photo",
  testimonials: "Testimonials",
  portfolio: "Portfolio",
};

/** Distinct tint per kind so All-table badges scan quickly. */
export const CLIENT_CONTENT_KIND_BADGE_CLASSES: Record<
  ClientContentKind,
  string
> = {
  logo: "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-300",
  photos: "border-transparent bg-violet-500/15 text-violet-700 dark:text-violet-300",
  testimonials:
    "border-transparent bg-amber-500/15 text-amber-800 dark:text-amber-300",
  portfolio:
    "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};
