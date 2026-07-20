/** Text colors for package titles — assigned by category list index or hash fallback. */
export const PRICE_CATEGORY_TITLE_CLASSES = [
  "text-teal-700 dark:text-teal-400",
  "text-indigo-700 dark:text-indigo-400",
  "text-orange-700 dark:text-orange-400",
  "text-pink-700 dark:text-pink-400",
  "text-cyan-700 dark:text-cyan-400",
  "text-lime-700 dark:text-lime-400",
  "text-sky-700 dark:text-sky-400",
  "text-violet-700 dark:text-violet-400",
  "text-amber-700 dark:text-amber-400",
  "text-rose-700 dark:text-rose-400",
  "text-emerald-700 dark:text-emerald-400",
  "text-fuchsia-700 dark:text-fuchsia-400",
] as const;

const FALLBACK_TITLE_CLASS = "text-foreground";

function hashCategoryKey(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function normalizeCategoryKey(categoryId: string): string {
  return categoryId.trim().toLowerCase();
}

function resolveCategoryColorIndex(
  categoryId: string,
  knownCategoryIds: string[],
): number | null {
  const key = normalizeCategoryKey(categoryId);
  if (!key) {
    return null;
  }

  if (knownCategoryIds.length > 0) {
    const sorted = [
      ...new Set(knownCategoryIds.map(normalizeCategoryKey).filter(Boolean)),
    ].sort((left, right) => left.localeCompare(right));
    const index = sorted.indexOf(key);
    if (index >= 0) {
      return index;
    }
  }

  return hashCategoryKey(key);
}

/** Auto text color for package titles, keyed by price category. */
export function getPriceCategoryTitleClass(
  categoryId: string,
  knownCategoryIds: string[] = [],
): string {
  const index = resolveCategoryColorIndex(categoryId, knownCategoryIds);
  if (index === null) {
    return FALLBACK_TITLE_CLASS;
  }

  return PRICE_CATEGORY_TITLE_CLASSES[
    index % PRICE_CATEGORY_TITLE_CLASSES.length
  ];
}
