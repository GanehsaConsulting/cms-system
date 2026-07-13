export const CUSTOM_CATEGORY_BADGE_CLASSES = [
  "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  "bg-pink-500/15 text-pink-600 dark:text-pink-400",
  "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  "bg-lime-500/15 text-lime-600 dark:text-lime-400",
] as const;

export function getCustomCategoryBadgeClass(index: number): string {
  return CUSTOM_CATEGORY_BADGE_CLASSES[
    index % CUSTOM_CATEGORY_BADGE_CLASSES.length
  ];
}
