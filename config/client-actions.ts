export const CLIENT_ACTION_CONFIRMATIONS = {
  delete: (name: string) => ({
    title: "Move to Trash?",
    description: `Move "${name}" to Trash? Linked portfolio works will also be moved. You can restore them later from Trash.`,
    confirmLabel: "Move to Trash",
    variant: "destructive" as const,
  }),
  bulkDelete: (count: number) => ({
    title: count === 1 ? "Move to Trash?" : `Move ${count} clients to Trash?`,
    description:
      count === 1
        ? "Linked portfolio works will also be moved to Trash. You can restore them later."
        : `Linked portfolio works for these ${count} clients will also be moved to Trash. You can restore them later.`,
    confirmLabel: "Move to Trash",
    variant: "destructive" as const,
  }),
};
