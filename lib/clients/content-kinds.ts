import type { ClientContentKind } from "@/config/client-content-kinds";
import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";

function hasLogo(client: Client): boolean {
  return client.logo.trim().length > 0;
}

/** Content kinds present on a client (and optional linked portfolio works). */
export function getClientContentKinds(
  client: Client,
  works: Portfolio[] = [],
): ClientContentKind[] {
  const kinds: ClientContentKind[] = [];

  if (hasLogo(client)) {
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
 */
export function isClientLogoOnly(
  client: Client,
  works: Portfolio[] = [],
): boolean {
  if (!hasLogo(client)) {
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
