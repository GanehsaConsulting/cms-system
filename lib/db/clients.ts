import { and, desc, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import { assertBrandMatch } from "@/lib/brands/content-scope";
import { normalizeClient } from "@/lib/clients/normalize";
import { db } from "@/lib/db/client";
import { clients } from "@/lib/db/schema";
import type { Client, ClientInput } from "@/types/client";

function toIso(value: Date): string {
  return value.toISOString();
}

function rowToClient(row: typeof clients.$inferSelect): Client {
  return normalizeClient({
    id: row.id,
    brandId: row.brandId,
    name: row.name,
    logo: row.logo,
    website: row.website,
    description: row.description,
    featured: row.featured,
    testimonials: Array.isArray(row.testimonials) ? row.testimonials : [],
    photos: Array.isArray(row.photos) ? row.photos : [],
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
    deletedAt: row.deletedAt ? toIso(row.deletedAt) : null,
  });
}

function normalizeInput(input: ClientInput): ClientInput {
  return {
    name: input.name.trim(),
    logo: input.logo.trim(),
    website: input.website.trim(),
    description: input.description.trim(),
    featured: input.featured,
    testimonials: input.testimonials
      .map((item) => ({
        id: item.id || crypto.randomUUID(),
        quote: item.quote.trim(),
        authorName: item.authorName.trim(),
        authorTitle: item.authorTitle.trim(),
      }))
      .filter((item) => item.quote.length > 0 && item.authorName.length > 0),
    photos: input.photos
      .map((item) => ({
        id: item.id || crypto.randomUUID(),
        url: item.url.trim(),
        caption: item.caption.trim(),
      }))
      .filter((item) => item.url.length > 0),
  };
}

export async function getClients(brandId: string): Promise<Client[]> {
  const rows = await db
    .select()
    .from(clients)
    .where(and(eq(clients.brandId, brandId), isNull(clients.deletedAt)))
    .orderBy(desc(clients.updatedAt));

  return rows.map(rowToClient);
}

export async function getTrashedClients(brandId: string): Promise<Client[]> {
  const rows = await db
    .select()
    .from(clients)
    .where(and(eq(clients.brandId, brandId), isNotNull(clients.deletedAt)))
    .orderBy(desc(clients.deletedAt));

  return rows.map(rowToClient);
}

export async function getClientById(
  brandId: string,
  id: string,
  options?: { includeDeleted?: boolean },
): Promise<Client | null> {
  const rows = await db
    .select()
    .from(clients)
    .where(
      options?.includeDeleted
        ? and(eq(clients.id, id), eq(clients.brandId, brandId))
        : and(
            eq(clients.id, id),
            eq(clients.brandId, brandId),
            isNull(clients.deletedAt),
          ),
    )
    .limit(1);

  const client = rows[0] ? rowToClient(rows[0]) : null;
  if (!client) {
    return null;
  }

  try {
    assertBrandMatch(client, brandId, "Client not found");
    return client;
  } catch {
    return null;
  }
}

export async function createClient(
  brandId: string,
  input: ClientInput,
): Promise<Client> {
  const normalized = normalizeInput(input);
  const now = new Date();
  const id = crypto.randomUUID();

  const [row] = await db
    .insert(clients)
    .values({
      id,
      brandId,
      ...normalized,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToClient(row);
}

export async function updateClient(
  brandId: string,
  id: string,
  input: ClientInput,
): Promise<Client> {
  const current = await getClientById(brandId, id);
  if (!current) {
    throw new Error("Client not found");
  }

  const normalized = normalizeInput(input);
  const [row] = await db
    .update(clients)
    .set({
      ...normalized,
      brandId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clients.id, id),
        eq(clients.brandId, brandId),
        isNull(clients.deletedAt),
      ),
    )
    .returning();

  if (!row) {
    throw new Error("Client not found");
  }

  return rowToClient(row);
}

/** Soft-delete — moves client to Trash. */
export async function softDeleteClient(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getClientById(brandId, id);
  if (!current) {
    throw new Error("Client not found");
  }

  const now = new Date();
  await db
    .update(clients)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(clients.id, id),
        eq(clients.brandId, brandId),
        isNull(clients.deletedAt),
      ),
    );
}

export async function softDeleteClients(
  brandId: string,
  ids: string[],
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const now = new Date();
  const rows = await db
    .update(clients)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(clients.brandId, brandId),
        isNull(clients.deletedAt),
        inArray(clients.id, ids),
      ),
    )
    .returning({ id: clients.id });

  return rows.length;
}

export async function restoreClient(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getClientById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Client not found in Trash");
  }

  const now = new Date();
  await db
    .update(clients)
    .set({ deletedAt: null, updatedAt: now })
    .where(
      and(
        eq(clients.id, id),
        eq(clients.brandId, brandId),
        isNotNull(clients.deletedAt),
      ),
    );
}

/** Permanently remove a trashed client. */
export async function purgeClient(brandId: string, id: string): Promise<void> {
  const current = await getClientById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Client not found in Trash");
  }

  await db
    .delete(clients)
    .where(and(eq(clients.id, id), eq(clients.brandId, brandId)));
}

export async function purgeClients(
  brandId: string,
  ids: string[],
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .delete(clients)
    .where(
      and(
        eq(clients.brandId, brandId),
        isNotNull(clients.deletedAt),
        inArray(clients.id, ids),
      ),
    )
    .returning({ id: clients.id });

  return rows.length;
}

export async function purgeAllTrashedClients(brandId: string): Promise<number> {
  const rows = await db
    .delete(clients)
    .where(and(eq(clients.brandId, brandId), isNotNull(clients.deletedAt)))
    .returning({ id: clients.id });

  return rows.length;
}

/** Hard-delete a client row (any state). Prefer softDeleteClient for CMS deletes. */
export async function deleteClient(brandId: string, id: string): Promise<void> {
  await db
    .delete(clients)
    .where(and(eq(clients.id, id), eq(clients.brandId, brandId)));
}

export async function setClientsFeatured(
  brandId: string,
  ids: string[],
  featured: boolean,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .update(clients)
    .set({
      featured,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clients.brandId, brandId),
        isNull(clients.deletedAt),
        inArray(clients.id, ids),
      ),
    )
    .returning({ id: clients.id });

  return rows.length;
}
