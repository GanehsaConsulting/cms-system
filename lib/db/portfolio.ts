import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getClientById } from "@/lib/db/clients";
import { normalizePortfolio } from "@/lib/portfolio/normalize";
import type { Portfolio, PortfolioInput } from "@/types/portfolio";

const DATA_PATH = path.join(process.cwd(), "data/portfolio.json");

async function readPortfolioItems(): Promise<Portfolio[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const items = JSON.parse(raw) as Portfolio[];
    return items.map(normalizePortfolio);
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

async function writePortfolioItems(items: Portfolio[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(items, null, 2)}\n`, "utf-8");
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

async function assertClientExists(clientId: string) {
  const client = await getClientById(clientId);
  if (!client) {
    throw new Error("Selected client was not found");
  }
}

export async function getPortfolioItems(): Promise<Portfolio[]> {
  const items = await readPortfolioItems();
  return items.sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getPortfolioById(id: string): Promise<Portfolio | null> {
  const items = await readPortfolioItems();
  return items.find((item) => item.id === id) ?? null;
}

export async function getPortfolioByClientId(
  clientId: string,
): Promise<Portfolio[]> {
  const items = await readPortfolioItems();
  return items
    .filter((item) => item.clientId === clientId)
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime(),
    );
}

export async function createPortfolio(
  input: PortfolioInput,
): Promise<Portfolio> {
  const normalized = normalizeInput(input);
  await assertClientExists(normalized.clientId);

  const items = await readPortfolioItems();
  const now = new Date().toISOString();
  const item: Portfolio = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };

  items.push(item);
  await writePortfolioItems(items);
  return item;
}

export async function updatePortfolio(
  id: string,
  input: PortfolioInput,
): Promise<Portfolio> {
  const normalized = normalizeInput(input);
  await assertClientExists(normalized.clientId);

  const items = await readPortfolioItems();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Portfolio item not found");
  }

  const updated: Portfolio = {
    ...items[index],
    ...normalized,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updated;
  await writePortfolioItems(items);
  return updated;
}

export async function deletePortfolio(id: string): Promise<void> {
  const items = await readPortfolioItems();
  const next = items.filter((item) => item.id !== id);

  if (next.length === items.length) {
    throw new Error("Portfolio item not found");
  }

  await writePortfolioItems(next);
}

export async function deletePortfolioByClientId(
  clientId: string,
): Promise<void> {
  const items = await readPortfolioItems();
  const next = items.filter((item) => item.clientId !== clientId);

  if (next.length === items.length) {
    return;
  }

  await writePortfolioItems(next);
}
