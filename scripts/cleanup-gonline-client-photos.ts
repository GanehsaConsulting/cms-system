/**
 * Remove GONLINE client gallery photos that were incorrectly copied from
 * portfolio cover images by an older seed script.
 *
 * Usage:
 *   npx tsx scripts/cleanup-gonline-client-photos.ts
 *   npx tsx scripts/cleanup-gonline-client-photos.ts --apply
 */
import "dotenv/config";
import { getClients, updateClient } from "../lib/db/clients";
import { getPortfolioItems } from "../lib/db/portfolio";

const BRAND_ID = "gonline";

function parseArgs(argv: string[]) {
  return {
    apply: argv.includes("--apply"),
  };
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";

  const clients = await getClients(BRAND_ID);
  const works = await getPortfolioItems(BRAND_ID);
  const workCoverUrlsByClientId = new Map<string, Set<string>>();

  for (const work of works) {
    const url = work.coverImage.trim();
    if (!url) {
      continue;
    }

    const current = workCoverUrlsByClientId.get(work.clientId) ?? new Set<string>();
    current.add(url);
    workCoverUrlsByClientId.set(work.clientId, current);
  }

  let clientsScanned = 0;
  let clientsUpdated = 0;
  let photosRemoved = 0;

  console.log(`[${mode}] brand=${BRAND_ID}`);

  for (const client of clients) {
    clientsScanned += 1;
    if (client.photos.length === 0) {
      continue;
    }

    const coverUrls = workCoverUrlsByClientId.get(client.id);
    if (!coverUrls || coverUrls.size === 0) {
      continue;
    }

    const nextPhotos = client.photos.filter(
      (photo) => !coverUrls.has(photo.url.trim()),
    );
    const removedCount = client.photos.length - nextPhotos.length;

    if (removedCount === 0) {
      continue;
    }

    console.log(`  ~ ${client.name}: remove ${removedCount} mirrored photo(s)`);

    if (apply) {
      await updateClient(BRAND_ID, client.id, {
        name: client.name,
        logo: client.logo,
        website: client.website,
        description: client.description,
        featured: client.featured,
        testimonials: client.testimonials,
        photos: nextPhotos,
      });
    }

    clientsUpdated += 1;
    photosRemoved += removedCount;
  }

  console.log("\n--- result ---");
  console.log(`clients scanned=${clientsScanned}`);
  console.log(`clients updated=${clientsUpdated}`);
  console.log(`photos removed=${photosRemoved}`);
  console.log(apply ? "Done." : "Dry-run only. Re-run with --apply to write.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
