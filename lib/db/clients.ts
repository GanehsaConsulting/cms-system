import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeClient } from "@/lib/clients/normalize";
import type { Client, ClientInput } from "@/types/client";

const DATA_PATH = path.join(process.cwd(), "data/clients.json");

async function readClients(): Promise<Client[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const clients = JSON.parse(raw) as Client[];
    return clients.map(normalizeClient);
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

async function writeClients(clients: Client[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(clients, null, 2)}\n`, "utf-8");
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

export async function getClients(): Promise<Client[]> {
  const clients = await readClients();
  return clients.sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getClientById(id: string): Promise<Client | null> {
  const clients = await readClients();
  return clients.find((client) => client.id === id) ?? null;
}

export async function createClient(input: ClientInput): Promise<Client> {
  const clients = await readClients();
  const normalized = normalizeInput(input);
  const now = new Date().toISOString();

  const client: Client = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };

  clients.push(client);
  await writeClients(clients);
  return client;
}

export async function updateClient(
  id: string,
  input: ClientInput,
): Promise<Client> {
  const clients = await readClients();
  const index = clients.findIndex((client) => client.id === id);

  if (index === -1) {
    throw new Error("Client not found");
  }

  const updated: Client = {
    ...clients[index],
    ...normalizeInput(input),
    updatedAt: new Date().toISOString(),
  };

  clients[index] = updated;
  await writeClients(clients);
  return updated;
}

export async function deleteClient(id: string): Promise<void> {
  const clients = await readClients();
  const nextClients = clients.filter((client) => client.id !== id);

  if (nextClients.length === clients.length) {
    throw new Error("Client not found");
  }

  await writeClients(nextClients);
}
