import { and, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { assertBrandMatch } from "@/lib/brands/content-scope";
import { db } from "@/lib/db/client";
import { getClientById } from "@/lib/db/clients";
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
    clickCount: row.clickCount ?? 0,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
    deletedAt: row.deletedAt ? toIso(row.deletedAt) : null,
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
    .where(and(eq(portfolio.brandId, brandId), isNull(portfolio.deletedAt)))
    .orderBy(desc(portfolio.updatedAt));

  return rows.map(rowToPortfolio);
}

export async function getTrashedPortfolioItems(
  brandId: string,
): Promise<Portfolio[]> {
  const rows = await db
    .select()
    .from(portfolio)
    .where(and(eq(portfolio.brandId, brandId), isNotNull(portfolio.deletedAt)))
    .orderBy(desc(portfolio.deletedAt));

  return rows.map(rowToPortfolio);
}

export async function getPortfolioById(
  brandId: string,
  id: string,
  options?: { includeDeleted?: boolean },
): Promise<Portfolio | null> {
  const rows = await db
    .select()
    .from(portfolio)
    .where(
      options?.includeDeleted
        ? and(eq(portfolio.id, id), eq(portfolio.brandId, brandId))
        : and(
            eq(portfolio.id, id),
            eq(portfolio.brandId, brandId),
            isNull(portfolio.deletedAt),
          ),
    )
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
      and(
        eq(portfolio.brandId, brandId),
        eq(portfolio.clientId, clientId),
        isNull(portfolio.deletedAt),
      ),
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
    .where(
      and(
        eq(portfolio.id, id),
        eq(portfolio.brandId, brandId),
        isNull(portfolio.deletedAt),
      ),
    )
    .returning();

  if (!row) {
    throw new Error("Portfolio item not found");
  }

  return rowToPortfolio(row);
}

/** Soft-delete — moves work to Trash. */
export async function softDeletePortfolio(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getPortfolioById(brandId, id);
  if (!current) {
    throw new Error("Portfolio item not found");
  }

  const now = new Date();
  await db
    .update(portfolio)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(portfolio.id, id),
        eq(portfolio.brandId, brandId),
        isNull(portfolio.deletedAt),
      ),
    );
}

export async function softDeletePortfolios(
  brandId: string,
  ids: string[],
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const now = new Date();
  const rows = await db
    .update(portfolio)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(portfolio.brandId, brandId),
        isNull(portfolio.deletedAt),
        inArray(portfolio.id, ids),
      ),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function softDeletePortfolioByClientId(
  brandId: string,
  clientId: string,
): Promise<number> {
  const now = new Date();
  const rows = await db
    .update(portfolio)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(portfolio.brandId, brandId),
        eq(portfolio.clientId, clientId),
        isNull(portfolio.deletedAt),
      ),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function softDeletePortfolioByClientIds(
  brandId: string,
  clientIds: string[],
): Promise<number> {
  if (clientIds.length === 0) {
    return 0;
  }

  const now = new Date();
  const rows = await db
    .update(portfolio)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(portfolio.brandId, brandId),
        isNull(portfolio.deletedAt),
        inArray(portfolio.clientId, clientIds),
      ),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function restorePortfolio(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getPortfolioById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Portfolio item not found in Trash");
  }

  const now = new Date();
  await db
    .update(portfolio)
    .set({ deletedAt: null, updatedAt: now })
    .where(
      and(
        eq(portfolio.id, id),
        eq(portfolio.brandId, brandId),
        isNotNull(portfolio.deletedAt),
      ),
    );
}

/** Restore all trashed works for a client (used when restoring that client). */
export async function restorePortfolioByClientId(
  brandId: string,
  clientId: string,
): Promise<number> {
  const now = new Date();
  const rows = await db
    .update(portfolio)
    .set({ deletedAt: null, updatedAt: now })
    .where(
      and(
        eq(portfolio.brandId, brandId),
        eq(portfolio.clientId, clientId),
        isNotNull(portfolio.deletedAt),
      ),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function purgePortfolio(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getPortfolioById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Portfolio item not found in Trash");
  }

  await db
    .delete(portfolio)
    .where(and(eq(portfolio.id, id), eq(portfolio.brandId, brandId)));
}

export async function purgePortfolios(
  brandId: string,
  ids: string[],
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .delete(portfolio)
    .where(
      and(
        eq(portfolio.brandId, brandId),
        isNotNull(portfolio.deletedAt),
        inArray(portfolio.id, ids),
      ),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function purgePortfolioByClientId(
  brandId: string,
  clientId: string,
): Promise<number> {
  const rows = await db
    .delete(portfolio)
    .where(
      and(eq(portfolio.brandId, brandId), eq(portfolio.clientId, clientId)),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function purgeAllTrashedPortfolio(
  brandId: string,
): Promise<number> {
  const rows = await db
    .delete(portfolio)
    .where(and(eq(portfolio.brandId, brandId), isNotNull(portfolio.deletedAt)))
    .returning({ id: portfolio.id });

  return rows.length;
}

/** Hard-delete a portfolio row (any state). Prefer softDeletePortfolio for CMS deletes. */
export async function deletePortfolio(
  brandId: string,
  id: string,
): Promise<void> {
  await db
    .delete(portfolio)
    .where(and(eq(portfolio.id, id), eq(portfolio.brandId, brandId)));
}

/** Hard-delete all portfolio rows for a client. */
export async function deletePortfolioByClientId(
  brandId: string,
  clientId: string,
): Promise<void> {
  await purgePortfolioByClientId(brandId, clientId);
}

export async function setPortfolioFeatured(
  brandId: string,
  ids: string[],
  featured: boolean,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .update(portfolio)
    .set({
      featured,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(portfolio.brandId, brandId),
        isNull(portfolio.deletedAt),
        inArray(portfolio.id, ids),
      ),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function setPortfolioWorkType(
  brandId: string,
  ids: string[],
  workType: Portfolio["workType"],
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .update(portfolio)
    .set({
      workType,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(portfolio.brandId, brandId),
        isNull(portfolio.deletedAt),
        inArray(portfolio.id, ids),
      ),
    )
    .returning({ id: portfolio.id });

  return rows.length;
}

export async function deletePortfolios(
  brandId: string,
  ids: string[],
): Promise<number> {
  return softDeletePortfolios(brandId, ids);
}

export async function incrementPortfolioClick(
  brandId: string,
  id: string,
): Promise<number> {
  const [row] = await db
    .update(portfolio)
    .set({
      clickCount: sql`${portfolio.clickCount} + 1`,
    })
    .where(
      and(
        eq(portfolio.brandId, brandId),
        eq(portfolio.id, id),
        isNull(portfolio.deletedAt),
      ),
    )
    .returning({ clickCount: portfolio.clickCount });

  if (!row) {
    throw new Error("Portfolio item not found");
  }

  return row.clickCount;
}
