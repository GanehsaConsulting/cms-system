import type {
  BannerListSort,
  BannerStatusFilter,
} from "@/config/banner-list";
import { paginateList } from "@/lib/list/pagination";
import type { Banner } from "@/types/banner";

export function filterBanners(
  banners: Banner[],
  statusFilter: BannerStatusFilter,
  search: string,
) {
  const query = search.trim().toLowerCase();

  return banners.filter((banner) => {
    if (statusFilter === "active" && !banner.isActive) {
      return false;
    }

    if (statusFilter === "inactive" && banner.isActive) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      banner.name.toLowerCase().includes(query) ||
      banner.key.toLowerCase().includes(query) ||
      banner.redirectUrl.toLowerCase().includes(query)
    );
  });
}

export function sortBanners(banners: Banner[], sort: BannerListSort) {
  const next = [...banners];

  next.sort((left, right) => {
    switch (sort) {
      case "name-asc":
        return left.name.localeCompare(right.name);
      case "name-desc":
        return right.name.localeCompare(left.name);
      case "key-asc":
        return left.key.localeCompare(right.key);
      case "key-desc":
        return right.key.localeCompare(left.key);
      case "status-asc":
        return Number(left.isActive) - Number(right.isActive);
      case "status-desc":
        return Number(right.isActive) - Number(left.isActive);
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

export function paginateBanners(
  banners: Banner[],
  page: number,
  pageSize: number,
) {
  return paginateList(banners, page, pageSize);
}

export function formatBannerDateParts(iso: string) {
  const date = new Date(iso);

  return {
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
}
