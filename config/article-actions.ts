export const ARTICLE_ACTION_CONFIRMATIONS = {
  delete: (title: string) => ({
    title: "Move to Trash?",
    description: `Move "${title}" to Trash? You can restore it later from Trash.`,
    confirmLabel: "Move to Trash",
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
      "This article stays private until the scheduled time, then publishes automatically.",
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
