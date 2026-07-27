import type { TrashKind, TrashListItem } from "@/types/trash";

export const TRASH_RETENTION_DAYS = 30;

/** Items with this many days (or fewer) left count as “Expires soon”. */
export const TRASH_EXPIRES_SOON_DAYS = 7;

export const TRASH_COPY = {
  title: "Trash",
  description:
    "Items in trash are kept for 30 days before being permanently deleted. You can restore or delete them manually anytime.",
  emptyTitle: "Trash is empty",
  emptyDescription:
    "Items you delete from Articles, Prices, Clients & Works, Activities, Banners, or Media will appear here.",
} as const;

export const TRASH_KIND_LABELS: Record<TrashKind, string> = {
  client: "Client",
  portfolio: "Work",
  article: "Article",
  price: "Price plan",
  activity: "Activity",
  banner: "Banner",
  "media-file": "File",
  "media-folder": "Folder",
};

/** Colored type chips — calm, readable on glass (not neon). */
export const TRASH_KIND_BADGE_CLASS: Record<TrashKind, string> = {
  client:
    "bg-orange-500/15 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
  portfolio:
    "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  article:
    "bg-blue-500/15 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  price:
    "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  activity:
    "bg-yellow-500/15 text-yellow-800 dark:bg-yellow-400/15 dark:text-yellow-300",
  banner:
    "bg-purple-500/15 text-purple-700 dark:bg-purple-400/15 dark:text-purple-300",
  "media-file":
    "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-300",
  "media-folder":
    "bg-sky-500/15 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
};

export const TRASH_ACTION_CONFIRMATIONS = {
  restore: (title: string, kindLabel: string) => ({
    title: "Restore item?",
    description: `Restore ${kindLabel.toLowerCase()} "${title}" to its list?`,
    confirmLabel: "Restore",
    variant: "default" as const,
  }),
  restoreClient: (name: string) => ({
    title: "Restore client?",
    description: `Restore "${name}" and its linked works to Clients & Works?`,
    confirmLabel: "Restore",
    variant: "default" as const,
  }),
  purge: (title: string, kindLabel: string) => ({
    title: "Delete forever?",
    description: `Permanently delete ${kindLabel.toLowerCase()} "${title}"? This cannot be undone.`,
    confirmLabel: "Delete forever",
    variant: "destructive" as const,
  }),
  purgeClient: (name: string) => ({
    title: "Delete forever?",
    description: `Permanently delete "${name}" and its linked works? This cannot be undone.`,
    confirmLabel: "Delete forever",
    variant: "destructive" as const,
  }),
  emptyTrash: {
    title: "Empty Trash?",
    description:
      "Permanently delete everything in Trash? This cannot be undone.",
    confirmLabel: "Empty Trash",
    variant: "destructive" as const,
  },
  bulkRestore: (count: number) => ({
    title: count === 1 ? "Restore item?" : `Restore ${count} items?`,
    description:
      count === 1
        ? "This item will be restored to its list."
        : `These ${count} items will be restored to their lists.`,
    confirmLabel: "Restore selected",
    variant: "default" as const,
  }),
  bulkPurge: (count: number) => ({
    title: count === 1 ? "Delete forever?" : `Delete ${count} items forever?`,
    description:
      count === 1
        ? "This item will be permanently deleted. This cannot be undone."
        : `These ${count} items will be permanently deleted. This cannot be undone.`,
    confirmLabel: "Delete selected",
    variant: "destructive" as const,
  }),
} as const;

export function getTrashExpiresAt(deletedAt: string): Date {
  const date = new Date(deletedAt);
  date.setDate(date.getDate() + TRASH_RETENTION_DAYS);
  return date;
}

export function getTrashDaysLeft(deletedAt: string, now = new Date()): number {
  const expiresAt = getTrashExpiresAt(deletedAt).getTime();
  const msLeft = expiresAt - now.getTime();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

export function getTrashAgeDays(deletedAt: string, now = new Date()): number {
  const ms = now.getTime() - new Date(deletedAt).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function formatTrashDeletedAt(deletedAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(deletedAt));
}

export function formatTrashDeletedAtPrecise(deletedAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(deletedAt));
}

export function formatTrashDaysLeft(daysLeft: number): string {
  if (daysLeft <= 0) {
    return "Expired";
  }
  if (daysLeft === 1) {
    return "1 day left";
  }
  return `${daysLeft} days left`;
}

export function formatTrashAgeLabel(ageDays: number): string {
  if (ageDays <= 0) {
    return "Today";
  }
  if (ageDays === 1) {
    return "1 day ago";
  }
  return `${ageDays} days ago`;
}

export interface TrashListStats {
  total: number;
  expiresSoon: number;
  oldestAgeDays: number | null;
}

export function getTrashListStats(
  items: TrashListItem[],
  now = new Date(),
): TrashListStats {
  if (items.length === 0) {
    return { total: 0, expiresSoon: 0, oldestAgeDays: null };
  }

  let expiresSoon = 0;
  let oldestDeletedAt = items[0]!.deletedAt;

  for (const item of items) {
    const daysLeft = getTrashDaysLeft(item.deletedAt, now);
    if (daysLeft <= TRASH_EXPIRES_SOON_DAYS) {
      expiresSoon += 1;
    }
    if (new Date(item.deletedAt).getTime() < new Date(oldestDeletedAt).getTime()) {
      oldestDeletedAt = item.deletedAt;
    }
  }

  return {
    total: items.length,
    expiresSoon,
    oldestAgeDays: getTrashAgeDays(oldestDeletedAt, now),
  };
}
