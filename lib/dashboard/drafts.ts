import type { Article } from "@/types/article";

/** Drafts that still need work — oldest updates first. */
export function getDraftsNeedingAttention(
  articles: Article[],
  limit: number,
): Article[] {
  return articles
    .filter((article) => article.status === "draft")
    .sort(
      (left, right) =>
        new Date(left.updatedAt).getTime() -
        new Date(right.updatedAt).getTime(),
    )
    .slice(0, limit);
}

export function getDaysSinceUpdate(isoDate: string, now = new Date()): number {
  const updated = new Date(isoDate).getTime();
  if (Number.isNaN(updated)) {
    return 0;
  }

  const diffMs = Math.max(0, now.getTime() - updated);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDaysSinceUpdate(days: number): string {
  if (days <= 0) {
    return "Updated today";
  }

  if (days === 1) {
    return "1 day ago";
  }

  return `${days} days ago`;
}
