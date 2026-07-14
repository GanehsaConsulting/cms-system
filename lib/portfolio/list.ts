import type {
  PortfolioListSort,
  PortfolioWorkTypeFilter,
} from "@/config/portfolio-list";
import { PORTFOLIO_LIST_PAGE_SIZE } from "@/config/portfolio-list";
import { paginateList } from "@/lib/list/pagination";
import type { Portfolio } from "@/types/portfolio";

const DATE_LOCALE = "en-US";

export function formatPortfolioDate(value: string) {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatPortfolioDateParts(value: string) {
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

export function getPortfolioSearchText(
  item: Portfolio,
  clientNameById: Map<string, string>,
) {
  return [
    item.id,
    item.title,
    item.description,
    item.url,
    item.workType,
    clientNameById.get(item.clientId) ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function filterPortfolioItems(
  items: Portfolio[],
  workType: PortfolioWorkTypeFilter,
  query: string,
  clientNameById: Map<string, string>,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    if (workType !== "all" && item.workType !== workType) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getPortfolioSearchText(item, clientNameById).includes(
      normalizedQuery,
    );
  });
}

export function sortPortfolioItems(
  items: Portfolio[],
  sort: PortfolioListSort,
) {
  const next = [...items];

  next.sort((left, right) => {
    switch (sort) {
      case "title-asc":
        return left.title.localeCompare(right.title);
      case "title-desc":
        return right.title.localeCompare(left.title);
      case "featured-asc":
        return Number(left.featured) - Number(right.featured);
      case "featured-desc":
        return Number(right.featured) - Number(left.featured);
      case "updated-asc":
        return (
          new Date(left.updatedAt).getTime() -
          new Date(right.updatedAt).getTime()
        );
      case "updated-desc":
      default:
        return (
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime()
        );
    }
  });

  return next;
}

export function paginatePortfolioItems(
  items: Portfolio[],
  page: number,
  pageSize = PORTFOLIO_LIST_PAGE_SIZE,
) {
  return paginateList(items, page, pageSize);
}
