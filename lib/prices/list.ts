import type { PriceListSort, PriceStatusFilter } from "@/config/price-list";
import { PRICE_LIST_PAGE_SIZE } from "@/config/price-list";
import { getLocalizedSearchText } from "@/lib/locale";
import { paginateList } from "@/lib/list/pagination";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import type { Price } from "@/types/price";

const DATE_LOCALE = "en-US";

export const priceStatusLabels = {
  active: "Active",
  inactive: "Inactive",
} as const;

export function formatPriceDate(value: string) {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatPriceDateParts(value: string) {
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

export function countPricesByStatus(prices: Price[]) {
  const counts: Record<PriceStatusFilter, number> = {
    all: prices.length,
    active: 0,
    inactive: 0,
  };

  for (const price of prices) {
    if (price.isActive) {
      counts.active += 1;
    } else {
      counts.inactive += 1;
    }
  }

  return counts;
}

export function getPriceSearchText(price: Price) {
  return [
    price.id,
    price.slug,
    price.serviceSlug,
    price.category,
    getLocalizedSearchText(price.service),
    getLocalizedSearchText(price.packageName),
    getLocalizedSearchText(price.description),
    price.whatsappPhone,
    getLocalizedSearchText(price.whatsappMessage),
    ...price.features.flatMap((feature) => getLocalizedSearchText(feature.name)),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterPrices(
  prices: Price[],
  status: PriceStatusFilter,
  query: string,
  serviceSlug: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return prices.filter((price) => {
    const matchesStatus =
      status === "all" ||
      (status === "active" && price.isActive) ||
      (status === "inactive" && !price.isActive);

    if (!matchesStatus) {
      return false;
    }

    const matchesService =
      serviceSlug === "all" || price.serviceSlug === serviceSlug;

    if (!matchesService) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getPriceSearchText(price).includes(normalizedQuery);
  });
}

export function sortPrices(prices: Price[], sort: PriceListSort) {
  const next = [...prices];

  next.sort((left, right) => {
    switch (sort) {
      case "updated-asc":
        return (
          new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime()
        );
      case "package-asc":
        return getPriceDisplayText(left.packageName).localeCompare(
          getPriceDisplayText(right.packageName),
          "en",
        );
      case "package-desc":
        return getPriceDisplayText(right.packageName).localeCompare(
          getPriceDisplayText(left.packageName),
          "en",
        );
      case "service-asc":
        return getPriceDisplayText(left.service).localeCompare(
          getPriceDisplayText(right.service),
          "en",
        );
      case "service-desc":
        return getPriceDisplayText(right.service).localeCompare(
          getPriceDisplayText(left.service),
          "en",
        );
      case "price-asc":
        return left.price - right.price;
      case "price-desc":
        return right.price - left.price;
      case "status-asc": {
        const leftLabel = left.isActive
          ? priceStatusLabels.active
          : priceStatusLabels.inactive;
        const rightLabel = right.isActive
          ? priceStatusLabels.active
          : priceStatusLabels.inactive;
        return leftLabel.localeCompare(rightLabel, "en");
      }
      case "status-desc": {
        const leftLabel = left.isActive
          ? priceStatusLabels.active
          : priceStatusLabels.inactive;
        const rightLabel = right.isActive
          ? priceStatusLabels.active
          : priceStatusLabels.inactive;
        return rightLabel.localeCompare(leftLabel, "en");
      }
      case "updated-desc":
      default:
        return (
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
        );
    }
  });

  return next;
}

export function paginatePrices<T>(
  items: T[],
  page: number,
  pageSize: number = PRICE_LIST_PAGE_SIZE,
) {
  return paginateList(items, page, pageSize);
}

export function getUniqueServiceSlugs(prices: Price[]) {
  return [...new Set(prices.map((price) => price.serviceSlug).filter(Boolean))].sort(
    (left, right) => left.localeCompare(right, "en"),
  );
}
