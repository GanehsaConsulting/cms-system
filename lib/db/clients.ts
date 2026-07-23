import { and, desc, eq } from "drizzle-orm";
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
    .where(eq(clients.brandId, brandId))
    .orderBy(desc(clients.updatedAt));

  return rows.map(rowToClient);
}

export async function getClientById(
  brandId: string,
  id: string,
): Promise<Client | null> {
  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
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
    .where(and(eq(clients.id, id), eq(clients.brandId, brandId)))
    .returning();

  if (!row) {
    throw new Error("Client not found");
  }

  return rowToClient(row);
}

export async function deleteClient(brandId: string, id: string): Promise<void> {
  const current = await getClientById(brandId, id);
  if (!current) {
    throw new Error("Client not found");
  }

  await db
    .delete(clients)
    .where(and(eq(clients.id, id), eq(clients.brandId, brandId)));
}
