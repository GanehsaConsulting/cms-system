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
