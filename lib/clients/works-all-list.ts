import type {
  ClientFeaturedFilter,
  ClientListSort,
  ClientsWorksAllPortfolioFilter,
} from "@/config/clients-works-all";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";
import { getClientSearchText } from "@/lib/clients/list";

function getGroupSearchText(group: ClientWithWorks) {
  return [
    getClientSearchText(group.client),
    ...group.works.flatMap((work) => [
      work.title,
      work.description,
      work.url,
      work.workType,
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterClientsWorksAllGroups(
  groups: ClientWithWorks[],
  featured: ClientFeaturedFilter,
  portfolioFilter: ClientsWorksAllPortfolioFilter,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return groups.filter((group) => {
    const { client, works } = group;

    if (featured === "featured" && !client.featured) {
      return false;
    }

    if (featured === "standard" && client.featured) {
      return false;
    }

    if (portfolioFilter === "with-works" && works.length === 0) {
      return false;
    }

    if (portfolioFilter === "without-works" && works.length > 0) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getGroupSearchText(group).includes(normalizedQuery);
  });
}

export function sortClientsWorksAllGroups(
  groups: ClientWithWorks[],
  sort: ClientListSort,
) {
  const items = [...groups];

  items.sort((left, right) => {
    const leftClient = left.client;
    const rightClient = right.client;

    switch (sort) {
      case "name-asc":
        return leftClient.name.localeCompare(rightClient.name);
      case "name-desc":
        return rightClient.name.localeCompare(leftClient.name);
      case "featured-asc":
        return Number(leftClient.featured) - Number(rightClient.featured);
      case "featured-desc":
        return Number(rightClient.featured) - Number(leftClient.featured);
      case "updated-asc":
        return (
          new Date(leftClient.updatedAt).getTime() -
          new Date(rightClient.updatedAt).getTime()
        );
      case "updated-desc":
      default:
        return (
          new Date(rightClient.updatedAt).getTime() -
          new Date(leftClient.updatedAt).getTime()
        );
    }
  });

  return items;
}
