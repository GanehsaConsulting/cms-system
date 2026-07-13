export const CLIENT_ACTION_CONFIRMATIONS = {
  delete: (name: string) => ({
    title: "Delete client?",
    description: `Delete "${name}"? Testimonials and gallery photos for this client will also be removed. This cannot be undone.`,
    confirmLabel: "Delete",
    variant: "destructive" as const,
  }),
};
