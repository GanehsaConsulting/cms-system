export const CONTENT_ACTIVITY_FORM_LIMITS = {
  title: 150,
  excerpt: 200,
  linkUrl: 500,
  maxImages: 12,
} as const;

export const CONTENT_ACTIVITY_ACTION_CONFIRMATIONS = {
  delete: {
    title: "Move to Trash?",
    description:
      "Move this activity or promo to Trash? You can restore it later from Trash.",
    confirmLabel: "Move to Trash",
    variant: "destructive" as const,
  },
  archive: {
    title: "Archive this item?",
    description: "It will be hidden from the public site but kept in the CMS.",
    confirmLabel: "Archive",
    variant: "default" as const,
  },
  cancelCreate: {
    title: "Discard new item?",
    description: "Unsaved changes will be lost.",
    confirmLabel: "Discard",
    variant: "destructive" as const,
  },
  cancelEdit: {
    title: "Discard changes?",
    description: "Unsaved changes will be lost.",
    confirmLabel: "Discard",
    variant: "destructive" as const,
  },
};
