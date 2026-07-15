export const ARTICLE_ACTION_CONFIRMATIONS = {
  delete: (title: string) => ({
    title: "Delete article?",
    description: `Delete "${title}"? This action cannot be undone.`,
    confirmLabel: "Delete",
    variant: "destructive" as const,
  }),
  publish: {
    title: "Publish article?",
    description:
      "This article will be visible on your company profile website.",
    confirmLabel: "Publish",
    variant: "default" as const,
  },
  schedule: {
    title: "Schedule article?",
    description:
      "This article will stay unpublished until the scheduled date and time.",
    confirmLabel: "Schedule",
    variant: "default" as const,
  },
  archive: {
    title: "Archive article?",
    description: "This article will be hidden from the public website.",
    confirmLabel: "Archive",
    variant: "default" as const,
  },
};
