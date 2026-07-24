/**
 * Import client photos from the legacy Ganesha CMS public API into
 * brand `ganesha-consulting` as Client.photos entries.
 *
 * Source: https://ganesha-cms.vercel.app/api/business/clients?limit=100
 *
 * Usage:
 *   npm run db:sync:ganesha-client-photos           # dry-run
 *   npm run db:sync:ganesha-client-photos -- --apply
 */
import "dotenv/config";
import { createClient, getClients, updateClient } from "../lib/db/clients";
import type { Client, ClientInput } from "../types/client";

const DEFAULT_BRAND = "ganesha-consulting";
const DEFAULT_SOURCE =
  "https://ganesha-cms.vercel.app/api/business/clients?limit=100";

const LEGACY_MARKER_PREFIX = "legacy-client-photo:";

interface LegacyClientRow {
  id: number;
  clientPhoto: string | null;
  companyLogo: string | null;
  clientName: string | null;
  companyName: string | null;
  clientReview: string | null;
  service?: { name?: string | null } | null;
}

interface LegacyClientsResponse {
  success?: boolean;
  data?: LegacyClientRow[];
}

function parseArgs(argv: string[]) {
  const apply = argv.includes("--apply");
  const brandIdx = argv.indexOf("--brand");
  const sourceIdx = argv.indexOf("--source");
  const brandId =
    brandIdx >= 0 && argv[brandIdx + 1]
      ? argv[brandIdx + 1].trim()
      : DEFAULT_BRAND;
  const sourceUrl =
    sourceIdx >= 0 && argv[sourceIdx + 1]
      ? argv[sourceIdx + 1].trim()
      : DEFAULT_SOURCE;

  return { apply, brandId, sourceUrl };
}

function isPlaceholder(value: string | null | undefined): boolean {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return true;
  }
  const lower = trimmed.toLowerCase();
  return lower === "-" || lower === "client photo";
}

function buildClientName(row: LegacyClientRow): string {
  if (!isPlaceholder(row.companyName)) {
    return row.companyName!.trim();
  }
  if (!isPlaceholder(row.clientName)) {
    return row.clientName!.trim();
  }

  const service = row.service?.name?.trim();
  if (service) {
    return `Client photo — ${service} (#${row.id})`;
  }

  return `Client photo #${row.id}`;
}

function legacyMarker(remoteId: number): string {
  return `${LEGACY_MARKER_PREFIX}${remoteId}`;
}

function findExistingByRemoteId(
  clients: Client[],
  remoteId: number,
): Client | undefined {
  const marker = legacyMarker(remoteId);
  return clients.find((client) => client.description.includes(marker));
}

function findExistingByPhotoUrl(
  clients: Client[],
  photoUrl: string,
): Client | undefined {
  return clients.find((client) =>
    client.photos.some((photo) => photo.url.trim() === photoUrl),
  );
}

function toClientInput(
  current: Client | null,
  row: LegacyClientRow,
  photoUrl: string,
): ClientInput {
  const caption = row.service?.name?.trim() || "";
  const existingPhotos = current?.photos ?? [];
  const alreadyHasPhoto = existingPhotos.some(
    (photo) => photo.url.trim() === photoUrl,
  );

  return {
    name: current?.name?.trim() || buildClientName(row),
    logo: current?.logo ?? "",
    website: current?.website ?? "",
    description:
      current?.description?.includes(legacyMarker(row.id))
        ? current.description
        : [
            current?.description?.trim(),
            legacyMarker(row.id),
            "Imported from legacy Ganesha CMS client photos.",
          ]
            .filter(Boolean)
            .join("\n"),
    featured: current?.featured ?? false,
    testimonials: current?.testimonials ?? [],
    photos: alreadyHasPhoto
      ? existingPhotos
      : [
          ...existingPhotos,
          {
            id: crypto.randomUUID(),
            url: photoUrl,
            caption,
          },
        ],
  };
}

async function fetchLegacyClients(sourceUrl: string): Promise<LegacyClientRow[]> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch legacy clients (${response.status})`);
  }

  const payload = (await response.json()) as LegacyClientsResponse;
  if (!Array.isArray(payload.data)) {
    throw new Error("Legacy clients response missing data[]");
  }

  return payload.data;
}

async function main() {
  const { apply, brandId, sourceUrl } = parseArgs(process.argv.slice(2));

  console.log(
    apply
      ? `Applying client photos → brand "${brandId}"`
      : `Dry-run client photos → brand "${brandId}" (pass --apply to write)`,
  );
  console.log(`Source: ${sourceUrl}`);

  const rows = await fetchLegacyClients(sourceUrl);
  const photoRows = rows.filter(
    (row) => typeof row.clientPhoto === "string" && row.clientPhoto.trim(),
  );

  console.log(
    `Legacy rows: ${rows.length} total, ${photoRows.length} with clientPhoto`,
  );

  const existing = await getClients(brandId);
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of photoRows) {
    const photoUrl = row.clientPhoto!.trim();
    const byMarker = findExistingByRemoteId(existing, row.id);
    const byUrl = findExistingByPhotoUrl(existing, photoUrl);
    const current = byMarker ?? byUrl ?? null;

    if (current && current.photos.some((photo) => photo.url.trim() === photoUrl)) {
      console.log(`  skip #${row.id} — already present (${current.name})`);
      skipped += 1;
      continue;
    }

    const input = toClientInput(current, row, photoUrl);
    const label = input.name;

    if (!apply) {
      console.log(
        `  would ${current ? "update" : "create"} #${row.id} → ${label}`,
      );
      if (current) {
        updated += 1;
      } else {
        created += 1;
      }
      continue;
    }

    if (current) {
      const next = await updateClient(brandId, current.id, input);
      const index = existing.findIndex((item) => item.id === current.id);
      if (index >= 0) {
        existing[index] = next;
      }
      console.log(`  updated #${row.id} → ${next.name}`);
      updated += 1;
    } else {
      const next = await createClient(brandId, input);
      existing.push(next);
      console.log(`  created #${row.id} → ${next.name}`);
      created += 1;
    }
  }

  console.log(
    `\nDone. created=${created} updated=${updated} skipped=${skipped}${
      apply ? "" : " (dry-run)"
    }`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
