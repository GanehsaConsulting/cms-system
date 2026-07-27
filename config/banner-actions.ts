export const BANNER_ACTION_CONFIRMATIONS = {
  delete: (name: string) => ({
    title: "Move to Trash?",
    description: `Move “${name}” to Trash? Site placements using this key will stop showing it until restored.`,
    confirmLabel: "Move to Trash",
  }),
};
