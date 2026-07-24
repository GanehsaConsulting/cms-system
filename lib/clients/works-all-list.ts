import type {
  ClientFeaturedFilter,
  ClientsWorksAllContentFilter,
  ClientsWorksAllListSort,
} from "@/config/clients-works-all";
import { isClientLogoOnly } from "@/lib/clients/content-kinds";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";
import { getClientSearchText } from "@/lib/clients/list";
import { hasClientLogo } from "@/lib/clients/logo";

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

function matchesContentFilter(
  group: ClientWithWorks,
  contentFilter: ClientsWorksAllContentFilter,
): ClientWithWorks | null {
  const { client, works } = group;

  switch (contentFilter) {
    case "logo":
      return hasClientLogo(client.logo) ? group : null;
    case "logo-only":
      return isClientLogoOnly(client, works) ? group : null;
    case "photos":
      return client.photos.some((photo) => photo.url.trim()) ? group : null;
    case "testimonials":
      return client.testimonials.length > 0 ? group : null;
    case "social-media": {
      const filteredWorks = works.filter(
        (work) => work.workType === "social-media",
      );
      return filteredWorks.length > 0 ? { client, works: filteredWorks } : null;
    }
    case "website": {
      const filteredWorks = works.filter((work) => work.workType === "website");
      return filteredWorks.length > 0 ? { client, works: filteredWorks } : null;
    }
    case "with-works":
      return works.length > 0 ? group : null;
    case "without-works":
      return works.length === 0 ? group : null;
    default:
      return group;
  }
}

export function filterClientsWorksAllGroups(
  groups: ClientWithWorks[],
  featured: ClientFeaturedFilter,
  contentFilter: ClientsWorksAllContentFilter,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  const next: ClientWithWorks[] = [];

  for (const group of groups) {
    const { client } = group;

    if (featured === "featured" && !client.featured) {
      continue;
    }

    if (featured === "standard" && client.featured) {
      continue;
    }

    const matched = matchesContentFilter(group, contentFilter);
    if (!matched) {
      continue;
    }

    if (
      normalizedQuery &&
      !getGroupSearchText(matched).includes(normalizedQuery)
    ) {
      continue;
    }

    next.push(matched);
  }

  return next;
}

export function sortClientsWorksAllGroups(
  groups: ClientWithWorks[],
  sort: ClientsWorksAllListSort,
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
      case "portfolio-asc":
        return left.works.length - right.works.length;
      case "portfolio-desc":
        return right.works.length - left.works.length;
      case "featured-asc":
        return Number(leftClient.featured) - Number(rightClient.featured);
      case "featured-desc":
        return Number(rightClient.featured) - Number(leftClient.featured);
      case "updated-asc":
        return (
          new Date(leftClient.updatedAt).getTime() -
          new Date(rightClient.updatedAt).getTime()
        );
      default:
        return (
          new Date(rightClient.updatedAt).getTime() -
          new Date(leftClient.updatedAt).getTime()
        );
    }
  });

  return items;
}
