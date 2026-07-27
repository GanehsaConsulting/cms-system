import { CMS_IMAGE_SOURCE_HINT } from "@/config/cms-image-source";

export const PORTFOLIO_FORM_LIMITS = {
  title: 120,
  description: 2000,
  url: 500,
} as const;

export const PORTFOLIO_COVER_UPLOAD_HINT = `${CMS_IMAGE_SOURCE_HINT} Used as the cover on the company profile.`;

export const PORTFOLIO_ACTION_CONFIRMATIONS = {
  delete: {
    title: "Move to Trash?",
    description:
      "This portfolio item will be moved to Trash. You can restore it later.",
    confirmLabel: "Move to Trash",
  },
  bulkDelete: (count: number) => ({
    title: count === 1 ? "Move to Trash?" : `Move ${count} works to Trash?`,
    description:
      count === 1
        ? "This portfolio item will be moved to Trash. You can restore it later."
        : `These ${count} portfolio items will be moved to Trash. You can restore them later.`,
    confirmLabel: "Move to Trash",
    variant: "destructive" as const,
  }),
} as const;
