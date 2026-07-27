/**
 * Remove GONLINE client logos that were incorrectly copied from portfolio cover
 * images by an older seed script.
 *
 * Usage:
 *   npx tsx scripts/cleanup-gonline-client-logos.ts
 *   npx tsx scripts/cleanup-gonline-client-logos.ts --apply
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

  console.log(`[${mode}] brand=${BRAND_ID}`);

  for (const client of clients) {
    clientsScanned += 1;

    const logo = client.logo.trim();
    if (!logo) {
      continue;
    }

    const coverUrls = workCoverUrlsByClientId.get(client.id);
    if (!coverUrls?.has(logo)) {
      continue;
    }

    console.log(`  ~ ${client.name}: clear mirrored logo`);

    if (apply) {
      await updateClient(BRAND_ID, client.id, {
        name: client.name,
        logo: "",
        website: client.website,
        description: client.description,
        featured: client.featured,
        testimonials: client.testimonials,
        photos: client.photos,
      });
    }

    clientsUpdated += 1;
  }

  console.log("\n--- result ---");
  console.log(`clients scanned=${clientsScanned}`);
  console.log(`clients updated=${clientsUpdated}`);
  console.log(apply ? "Done." : "Dry-run only. Re-run with --apply to write.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
