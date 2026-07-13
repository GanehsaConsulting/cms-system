export const BANNER_ACTION_CONFIRMATIONS = {
  delete: (name: string) => ({
    title: "Delete banner?",
    description: `“${name}” will be removed. Any site placement using this key will stop showing it.`,
    confirmLabel: "Delete",
  }),
};
