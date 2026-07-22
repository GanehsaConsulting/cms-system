import type {
  ContentActivitiesListSort,
  ContentActivityKindFilter,
  ContentActivityShowTitleFilter,
  ContentActivityStatusFilter,
} from "@/config/content-activities-list";
import { CONTENT_ACTIVITIES_LIST_PAGE_SIZE } from "@/config/content-activities-list";
import { paginateList } from "@/lib/list/pagination";
import type { ContentActivity } from "@/types/content-activity";

const DATE_LOCALE = "en-US";

export function formatContentActivityDate(value: string) {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatContentActivityDateParts(value: string) {
  const date = new Date(value);

  return {
    date: new Intl.DateTimeFormat(DATE_LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat(DATE_LOCALE, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
}

export function getContentActivitySearchText(item: ContentActivity) {
  return [item.id, item.title, item.excerpt, item.content, item.linkUrl]
    .join(" ")
    .toLowerCase();
}

export function countContentActivitiesByKind(
  items: ContentActivity[],
): Record<ContentActivityKindFilter, number> {
  let activity = 0;
  let promo = 0;

  for (const item of items) {
    if (item.kind === "promo") {
      promo += 1;
    } else {
      activity += 1;
    }
  }

  return {
    all: items.length,
    activity,
    promo,
  };
}

export function filterContentActivities(
  items: ContentActivity[],
  kindFilter: ContentActivityKindFilter,
  statusFilter: ContentActivityStatusFilter,
  showTitleFilter: ContentActivityShowTitleFilter,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    if (kindFilter !== "all" && item.kind !== kindFilter) {
      return false;
    }

    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    if (showTitleFilter === "shown" && !item.showTitle) {
      return false;
    }

    if (showTitleFilter === "hidden" && item.showTitle) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getContentActivitySearchText(item).includes(normalizedQuery);
  });
}

export function sortContentActivities(
  items: ContentActivity[],
  sort: ContentActivitiesListSort,
) {
  const next = [...items];

  next.sort((left, right) => {
    switch (sort) {
      case "title-asc":
        return left.title.localeCompare(right.title);
      case "title-desc":
        return right.title.localeCompare(left.title);
      case "display-asc":
        return (
          new Date(left.displayAt).getTime() -
          new Date(right.displayAt).getTime()
        );
      case "updated-asc":
        return (
          new Date(left.updatedAt).getTime() -
          new Date(right.updatedAt).getTime()
        );
      case "updated-desc":
        return (
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime()
        );
      case "clicks-desc":
        return right.clickCount - left.clickCount;
      case "display-desc":
      default:
        return (
          new Date(right.displayAt).getTime() -
          new Date(left.displayAt).getTime()
        );
    }
  });

  return next;
}

export function paginateContentActivities(
  items: ContentActivity[],
  page: number,
  pageSize = CONTENT_ACTIVITIES_LIST_PAGE_SIZE,
) {
  return paginateList(items, page, pageSize);
}

export function stripContentActivityHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
