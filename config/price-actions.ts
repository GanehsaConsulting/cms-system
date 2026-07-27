export const PRICE_ACTION_CONFIRMATIONS = {
  delete: (packageName: string) => ({
    title: "Move to Trash?",
    description: `Move "${packageName}" to Trash? You can restore it later from Trash.`,
    confirmLabel: "Move to Trash",
    variant: "destructive" as const,
  }),
  bulkDelete: (count: number) => ({
    title:
      count === 1
        ? "Move to Trash?"
        : `Move ${count} price plans to Trash?`,
    description:
      count === 1
        ? "This price plan will be moved to Trash. You can restore it later."
        : `These ${count} price plans will be moved to Trash. You can restore them later.`,
    confirmLabel: "Move to Trash",
    variant: "destructive" as const,
  }),
};
