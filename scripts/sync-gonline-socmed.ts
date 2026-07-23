/**
 * Seed GONLINE social-media clients + works into Postgres.
 * Reuses existing clients by name. Replaces only `social-media` portfolio
 * rows for gonline — website works are left untouched.
 *
 * Usage:
 *   npx tsx scripts/sync-gonline-socmed.ts           # dry-run
 *   npx tsx scripts/sync-gonline-socmed.ts --apply    # write
 */
import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { GONLINE_SOCMED_CLIENTS } from "../config/gonline-socmed-clients";
import { createClient, getClients } from "../lib/db/clients";
import { db } from "../lib/db/client";
import { createPortfolio } from "../lib/db/portfolio";
import { portfolio } from "../lib/db/schema";

const BRAND_ID = "gonline";

function parseArgs(argv: string[]) {
  return { apply: argv.includes("--apply") };
}

function normalizeCompanyKey(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";

  console.log(`[${mode}] brand=${BRAND_ID}`);
  console.log(`socmed seeds: ${GONLINE_SOCMED_CLIENTS.length}`);

  const existingClients = await getClients(BRAND_ID);
  const clientIdByName = new Map(
    existingClients.map((client) => [
      normalizeCompanyKey(client.name),
      client.id,
    ]),
  );

  let clientsCreated = 0;
  let clientsReused = 0;
  let worksInserted = 0;

  for (const seed of GONLINE_SOCMED_CLIENTS) {
    const key = normalizeCompanyKey(seed.brandName);
    const existingId = clientIdByName.get(key);
    const action = existingId ? "reuse-client" : "create-client";
    console.log(
      `  + ${action} ${seed.brandName} | ${seed.name} | ${seed.link}`,
    );

    if (!apply) {
      continue;
    }

    let clientId = existingId;
    if (!clientId) {
      const created = await createClient(BRAND_ID, {
        name: seed.brandName,
        logo: seed.preview,
        website: seed.link,
        description: seed.package.trim() || seed.name,
        featured: false,
        testimonials: [],
        photos: seed.preview
          ? [
              {
                id: crypto.randomUUID(),
                url: seed.preview,
                caption: seed.name,
              },
            ]
          : [],
      });
      clientId = created.id;
      clientIdByName.set(key, clientId);
      clientsCreated += 1;
    } else {
      clientsReused += 1;
    }
  }

  if (!apply) {
    console.log(
      "\nDry-run only. Re-run with --apply to seed social-media works.",
    );
    return;
  }

  await db
    .delete(portfolio)
    .where(
      and(
        eq(portfolio.brandId, BRAND_ID),
        eq(portfolio.workType, "social-media"),
      ),
    );

  for (const seed of GONLINE_SOCMED_CLIENTS) {
    const clientId = clientIdByName.get(normalizeCompanyKey(seed.brandName));
    if (!clientId) {
      throw new Error(`Missing client for ${seed.brandName}`);
    }

    const description = [seed.name, seed.package.trim()]
      .filter(Boolean)
      .join(" — ");

    await createPortfolio(BRAND_ID, {
      title: seed.brandName,
      clientId,
      workType: "social-media",
      coverImage: seed.preview,
      description: description || seed.brandName,
      url: seed.link,
      featured: false,
    });
    worksInserted += 1;
  }

  console.log("\n--- result ---");
  console.log(`clients created=${clientsCreated} reused=${clientsReused}`);
  console.log(`social-media works inserted=${worksInserted}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
