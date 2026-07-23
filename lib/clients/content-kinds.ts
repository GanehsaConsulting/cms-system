import type { ClientContentKind } from "@/config/client-content-kinds";
import { hasClientLogo, isCompanyLogoIcon } from "@/lib/clients/logo";
import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";

/** Content kinds present on a client (and optional linked portfolio works). */
export function getClientContentKinds(
  client: Client,
  works: Portfolio[] = [],
): ClientContentKind[] {
  const kinds: ClientContentKind[] = [];

  if (hasClientLogo(client.logo)) {
    kinds.push("logo");
  }
  if (client.photos.length > 0) {
    kinds.push("photos");
  }
  if (client.testimonials.length > 0) {
    kinds.push("testimonials");
  }
  if (works.length > 0) {
    kinds.push("portfolio");
  }

  return kinds;
}

/**
 * Logo-only: has a logo and no gallery photos, testimonials, or portfolio works.
 * (Legacy staging filter — prefer {@link filterClientsForLogosTab} for the Logos UI.)
 */
export function isClientLogoOnly(
  client: Client,
  works: Portfolio[] = [],
): boolean {
  if (!hasClientLogo(client.logo)) {
    return false;
  }

  return (
    client.photos.length === 0 &&
    client.testimonials.length === 0 &&
    works.length === 0
  );
}

export function filterLogoOnlyClients(
  clients: Client[],
  portfolio: Portfolio[],
): Client[] {
  const worksByClientId = new Map<string, Portfolio[]>();

  for (const item of portfolio) {
    const current = worksByClientId.get(item.clientId) ?? [];
    current.push(item);
    worksByClientId.set(item.clientId, current);
  }

  return clients.filter((client) =>
    isClientLogoOnly(client, worksByClientId.get(client.id) ?? []),
  );
}

/**
 * Logos tab + FE marquee source: clients with a logo URL.
 * Company-logo icons (`/company_logos/`) sort first — those are what FE marquee uses.
 */
export function filterClientsForLogosTab(clients: Client[]): Client[] {
  return clients
    .filter((client) => hasClientLogo(client.logo))
    .sort((left, right) => {
      const leftReady = isCompanyLogoIcon(left.logo) ? 0 : 1;
      const rightReady = isCompanyLogoIcon(right.logo) ? 0 : 1;
      if (leftReady !== rightReady) {
        return leftReady - rightReady;
      }
      return left.name.localeCompare(right.name, "en");
    });
}
