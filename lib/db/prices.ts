import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/articles/slug";
import {
  isLocalizedTextComplete,
  trimLocalized,
} from "@/lib/locale";
import { normalizePrice } from "@/lib/prices/normalize";
import type { Price, PriceFeature, PriceInput } from "@/types/price";
import type { LocalizedText } from "@/types/locale";

const DATA_PATH = path.join(process.cwd(), "data/prices.json");

async function readPrices(): Promise<Price[]> {
  const raw = await readFile(DATA_PATH, "utf-8");
  const prices = JSON.parse(raw) as Price[];
  return prices.map(normalizePrice);
}

async function writePrices(prices: Price[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(prices, null, 2)}\n`, "utf-8");
}

function trimOptionalLocalized(text: LocalizedText): LocalizedText {
  return {
    id: text.id.trim(),
    en: text.en.trim(),
    zh: text.zh.trim(),
  };
}

function normalizeFeatures(features: PriceFeature[]): PriceFeature[] {
  return features
    .map((feature, index) => ({
      id: feature.id || crypto.randomUUID(),
      name: trimLocalized(feature.name),
      sortOrder: index,
    }))
    .filter((feature) => isLocalizedTextComplete(feature.name))
    .map(({ sortOrder: _sortOrder, ...feature }) => feature);
}

function normalizeInput(input: PriceInput): PriceInput {
  const packageName = trimLocalized(input.packageName);
  const service = trimLocalized(input.service);

  return {
    slug: input.slug.trim() || slugify(packageName.id),
    serviceSlug: input.serviceSlug.trim() || slugify(service.id),
    category: input.category.trim(),
    highlighted: input.highlighted,
    description: trimOptionalLocalized(input.description),
    service,
    packageName,
    price: Math.max(0, Math.trunc(input.price)),
    strikethroughPrice: Math.max(0, Math.trunc(input.strikethroughPrice)),
    whatsappLink: trimLocalized(input.whatsappLink),
    isActive: input.isActive,
    features: normalizeFeatures(input.features),
  };
}

function nextPriceId(prices: Price[]): string {
  const maxId = prices.reduce((max, price) => {
    const numericId = Number.parseInt(price.id, 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);

  return String(maxId + 1);
}

export async function getPrices(): Promise<Price[]> {
  const prices = await readPrices();
  return prices.sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getPriceById(id: string): Promise<Price | null> {
  const prices = await readPrices();
  return prices.find((price) => price.id === id) ?? null;
}

export async function getPriceBySlug(slug: string): Promise<Price | null> {
  const prices = await readPrices();
  return prices.find((price) => price.slug === slug) ?? null;
}

export async function createPrice(input: PriceInput): Promise<Price> {
  const prices = await readPrices();
  const normalized = normalizeInput(input);
  const existing = prices.find((price) => price.slug === normalized.slug);

  if (existing) {
    throw new Error("Slug is already in use");
  }

  const now = new Date().toISOString();
  const price: Price = {
    id: nextPriceId(prices),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };

  prices.push(price);
  await writePrices(prices);
  return price;
}

export async function updatePrice(
  id: string,
  input: PriceInput,
): Promise<Price> {
  const prices = await readPrices();
  const index = prices.findIndex((price) => price.id === id);

  if (index === -1) {
    throw new Error("Price plan not found");
  }

  const normalized = normalizeInput(input);
  const slugTaken = prices.some(
    (price) => price.slug === normalized.slug && price.id !== id,
  );

  if (slugTaken) {
    throw new Error("Slug is already in use");
  }

  const updated: Price = {
    ...prices[index],
    ...normalized,
    updatedAt: new Date().toISOString(),
  };

  prices[index] = updated;
  await writePrices(prices);
  return updated;
}

export async function deletePrice(id: string): Promise<void> {
  const prices = await readPrices();
  const nextPrices = prices.filter((price) => price.id !== id);

  if (nextPrices.length === prices.length) {
    throw new Error("Price plan not found");
  }

  await writePrices(nextPrices);
}
