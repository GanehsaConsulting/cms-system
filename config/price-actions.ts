export const PRICE_ACTION_CONFIRMATIONS = {
  delete: (packageName: string) => ({
    title: "Delete price plan?",
    description: `Delete "${packageName}"? This action cannot be undone.`,
    confirmLabel: "Delete",
    variant: "destructive" as const,
  }),
};
