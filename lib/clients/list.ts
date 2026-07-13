import type {
  ClientFeaturedFilter,
  ClientListSort,
} from "@/config/client-list";
import { CLIENT_LIST_PAGE_SIZE } from "@/config/client-list";
import { paginateList } from "@/lib/list/pagination";
import type { Client } from "@/types/client";

const DATE_LOCALE = "en-US";

export function formatClientDate(value: string) {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatClientDateParts(value: string) {
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

export function getClientSearchText(client: Client) {
  return [
    client.id,
    client.name,
    client.website,
    client.description,
    ...client.testimonials.flatMap((item) => [
      item.quote,
      item.authorName,
      item.authorTitle,
    ]),
    ...client.photos.map((item) => item.caption),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterClients(
  clients: Client[],
  featured: ClientFeaturedFilter,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return clients.filter((client) => {
    if (featured === "featured" && !client.featured) {
      return false;
    }

    if (featured === "standard" && client.featured) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getClientSearchText(client).includes(normalizedQuery);
  });
}

export function sortClients(clients: Client[], sort: ClientListSort) {
  const items = [...clients];

  items.sort((left, right) => {
    switch (sort) {
      case "name-asc":
        return left.name.localeCompare(right.name);
      case "name-desc":
        return right.name.localeCompare(left.name);
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

  return items;
}

export function paginateClients(
  clients: Client[],
  page: number,
  pageSize = CLIENT_LIST_PAGE_SIZE,
) {
  return paginateList(clients, page, pageSize);
}
