import { and, desc, eq } from "drizzle-orm";
import { assertBrandMatch } from "@/lib/brands/content-scope";
import { getClientById } from "@/lib/db/clients";
import { db } from "@/lib/db/client";
import { portfolio } from "@/lib/db/schema";
import { normalizePortfolio } from "@/lib/portfolio/normalize";
import type { Portfolio, PortfolioInput } from "@/types/portfolio";

function toIso(value: Date): string {
  return value.toISOString();
}

function rowToPortfolio(row: typeof portfolio.$inferSelect): Portfolio {
  return normalizePortfolio({
    id: row.id,
    brandId: row.brandId,
    title: row.title,
    clientId: row.clientId,
    workType: row.workType as Portfolio["workType"],
    coverImage: row.coverImage,
    description: row.description,
    url: row.url,
    featured: row.featured,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  });
}

function normalizeInput(input: PortfolioInput): PortfolioInput {
  return {
    title: input.title.trim(),
    clientId: input.clientId.trim(),
    workType: input.workType,
    coverImage: input.coverImage.trim(),
    description: input.description.trim(),
    url: input.url.trim(),
    featured: input.featured,
  };
}

async function assertClientExists(brandId: string, clientId: string) {
  const client = await getClientById(brandId, clientId);
  if (!client) {
    throw new Error("Selected client was not found");
  }
}

export async function getPortfolioItems(brandId: string): Promise<Portfolio[]> {
  const rows = await db
    .select()
    .from(portfolio)
    .where(eq(portfolio.brandId, brandId))
    .orderBy(desc(portfolio.updatedAt));

  return rows.map(rowToPortfolio);
}

export async function getPortfolioById(
  brandId: string,
  id: string,
): Promise<Portfolio | null> {
  const rows = await db
    .select()
    .from(portfolio)
    .where(eq(portfolio.id, id))
    .limit(1);

  const item = rows[0] ? rowToPortfolio(rows[0]) : null;
  if (!item) {
    return null;
  }

  try {
    assertBrandMatch(item, brandId, "Portfolio item not found");
    return item;
  } catch {
    return null;
  }
}

export async function getPortfolioByClientId(
  brandId: string,
  clientId: string,
): Promise<Portfolio[]> {
  const rows = await db
    .select()
    .from(portfolio)
    .where(
      and(eq(portfolio.brandId, brandId), eq(portfolio.clientId, clientId)),
    )
    .orderBy(desc(portfolio.updatedAt));

  return rows.map(rowToPortfolio);
}

export async function createPortfolio(
  brandId: string,
  input: PortfolioInput,
): Promise<Portfolio> {
  const normalized = normalizeInput(input);
  await assertClientExists(brandId, normalized.clientId);

  const now = new Date();
  const [row] = await db
    .insert(portfolio)
    .values({
      id: crypto.randomUUID(),
      brandId,
      ...normalized,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToPortfolio(row);
}

export async function updatePortfolio(
  brandId: string,
  id: string,
  input: PortfolioInput,
): Promise<Portfolio> {
  const normalized = normalizeInput(input);
  await assertClientExists(brandId, normalized.clientId);

  const current = await getPortfolioById(brandId, id);
  if (!current) {
    throw new Error("Portfolio item not found");
  }

  const [row] = await db
    .update(portfolio)
    .set({
      ...normalized,
      brandId,
      updatedAt: new Date(),
    })
    .where(and(eq(portfolio.id, id), eq(portfolio.brandId, brandId)))
    .returning();

  if (!row) {
    throw new Error("Portfolio item not found");
  }

  return rowToPortfolio(row);
}

export async function deletePortfolio(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getPortfolioById(brandId, id);
  if (!current) {
    throw new Error("Portfolio item not found");
  }

  await db
    .delete(portfolio)
    .where(and(eq(portfolio.id, id), eq(portfolio.brandId, brandId)));
}

export async function deletePortfolioByClientId(
  brandId: string,
  clientId: string,
): Promise<void> {
  await db
    .delete(portfolio)
    .where(
      and(eq(portfolio.brandId, brandId), eq(portfolio.clientId, clientId)),
    );
}
