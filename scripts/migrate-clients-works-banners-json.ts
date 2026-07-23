/**
 * Import legacy clients / portfolio / banners JSON into Postgres.
 *
 * Usage:
 *   npx tsx scripts/migrate-clients-works-banners-json.ts
 *
 * Safe to re-run — existing ids are skipped.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getBannerImages } from "../lib/banners/images";
import { normalizeClient } from "../lib/clients/normalize";
import { db } from "../lib/db/client";
import { banners, clients, portfolio } from "../lib/db/schema";
import { normalizePortfolio } from "../lib/portfolio/normalize";
import type { Banner } from "../types/banner";
import type { Client } from "../types/client";
import type { Portfolio } from "../types/portfolio";

async function readJson<T>(relativePath: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(process.cwd(), relativePath), "utf-8");
    return JSON.parse(raw) as T[];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
}

async function main() {
  const clientRows = (await readJson<Client>("data/clients.json")).map(
    normalizeClient,
  );
  const portfolioRows = (await readJson<Portfolio>("data/portfolio.json")).map(
    normalizePortfolio,
  );
  const bannerRows = (await readJson<Banner & { image?: string }>(
    "data/banners.json",
  )).map((item) => ({
    ...item,
    brandId: String(item.brandId ?? "").trim(),
    images: getBannerImages(item),
  }));

  let clientsInserted = 0;
  let portfolioInserted = 0;
  let bannersInserted = 0;

  for (const client of clientRows) {
    if (!client.id || !client.brandId) {
      continue;
    }

    const existing = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.id, client.id))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(clients).values({
      id: client.id,
      brandId: client.brandId,
      name: client.name,
      logo: client.logo,
      website: client.website,
      description: client.description,
      featured: client.featured,
      testimonials: client.testimonials,
      photos: client.photos,
      createdAt: new Date(client.createdAt),
      updatedAt: new Date(client.updatedAt),
    });
    clientsInserted += 1;
  }

  for (const item of portfolioRows) {
    if (!item.id || !item.brandId) {
      continue;
    }

    const existing = await db
      .select({ id: portfolio.id })
      .from(portfolio)
      .where(eq(portfolio.id, item.id))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(portfolio).values({
      id: item.id,
      brandId: item.brandId,
      title: item.title,
      clientId: item.clientId,
      workType: item.workType,
      coverImage: item.coverImage,
      description: item.description,
      url: item.url,
      featured: item.featured,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    });
    portfolioInserted += 1;
  }

  for (const banner of bannerRows) {
    if (!banner.id || !banner.brandId || !banner.key) {
      continue;
    }

    const existing = await db
      .select({ id: banners.id })
      .from(banners)
      .where(eq(banners.id, banner.id))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(banners).values({
      id: banner.id,
      brandId: banner.brandId,
      name: banner.name,
      key: banner.key,
      images: banner.images,
      redirectUrl: banner.redirectUrl,
      isActive: banner.isActive,
      createdAt: new Date(banner.createdAt),
      updatedAt: new Date(banner.updatedAt),
    });
    bannersInserted += 1;
  }

  console.log(
    `Migrated clients=${clientsInserted} portfolio=${portfolioInserted} banners=${bannersInserted}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
