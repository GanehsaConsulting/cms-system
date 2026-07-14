export const PORTFOLIO_FORM_LIMITS = {
  title: 120,
  description: 2000,
  url: 500,
} as const;

export const PORTFOLIO_COVER_UPLOAD_HINT =
  "PNG, JPG, or WebP. Used as the cover on the company profile.";

export const PORTFOLIO_ACTION_CONFIRMATIONS = {
  delete: {
    title: "Delete work?",
    description:
      "This portfolio item will be removed. This cannot be undone.",
    confirmLabel: "Delete work",
  },
} as const;
