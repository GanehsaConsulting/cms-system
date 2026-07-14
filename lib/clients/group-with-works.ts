import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";

export interface ClientWithWorks {
  client: Client;
  works: Portfolio[];
}

/** Group portfolio under each client. Clients with works come first. */
export function groupClientsWithWorks(
  clients: Client[],
  portfolio: Portfolio[],
): ClientWithWorks[] {
  const worksByClientId = new Map<string, Portfolio[]>();

  for (const item of portfolio) {
    const current = worksByClientId.get(item.clientId) ?? [];
    current.push(item);
    worksByClientId.set(item.clientId, current);
  }

  for (const works of worksByClientId.values()) {
    works.sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime(),
    );
  }

  return [...clients]
    .map((client) => ({
      client,
      works: worksByClientId.get(client.id) ?? [],
    }))
    .sort((left, right) => {
      const leftHasWorks = left.works.length > 0 ? 1 : 0;
      const rightHasWorks = right.works.length > 0 ? 1 : 0;
      if (leftHasWorks !== rightHasWorks) {
        return rightHasWorks - leftHasWorks;
      }

      if (left.client.featured !== right.client.featured) {
        return Number(right.client.featured) - Number(left.client.featured);
      }

      return (
        new Date(right.client.updatedAt).getTime() -
        new Date(left.client.updatedAt).getTime()
      );
    });
}
