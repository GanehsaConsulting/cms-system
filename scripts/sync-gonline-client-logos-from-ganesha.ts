/**
 * Duplicate client logos from brand `ganesha-consulting` → `gonline`
 * by matching company names (exact / stripped / aliases).
 *
 * Usage:
 *   npx tsx scripts/sync-gonline-client-logos-from-ganesha.ts           # dry-run
 *   npx tsx scripts/sync-gonline-client-logos-from-ganesha.ts --apply    # write
 */
import "dotenv/config";
import { getClients, updateClient } from "../lib/db/clients";

const SOURCE_BRAND = "ganesha-consulting";
const TARGET_BRAND = "gonline";

/** gonline normalized name → possible ganesha-consulting names */
const NAME_ALIASES: Record<string, string[]> = {
  gab: ["pt gab dig jaya", "gab"],
  lpk: ["pt lpk hidamari kenshu senta", "lpk"],
  medlife: ["pt medlife abadi jaya", "medlife"],
  "bharata fresh": ["pt bharata alam sentosa", "bharata fresh"],
  "sgw indo logistik": ["pt sgw indo logistik", "sgw indo logistik"],
  krek: ["pt krek transformasi digital", "krek"],
  "people impact": [
    "people impact human resources consultant",
    "people impact",
  ],
  "pt blora inovasi sejahtera": [
    "pt blora inovasi sejahtera abadi",
    "pt blora inovasi sejahtera",
  ],
  "jasa cuci toren farhan": [
    "jasa cuci toren pipa farhan",
    "jasa cuci toren farhan",
  ],
  "pt lentera berkat wisesa": ["pt lentera berkat wisesa"],
  "pt ems": ["pt elka mitra sejahtera", "ems"],
  "jma indonesia": ["cv jelita makmur abadi", "jma"],
  "d racing": ["pt delapan djalan raya", "pt dlapan djalan raya"],
  kalanesia: ["pt kedaulatan alam indonesia"],
  seic: ["seic"],
  ganapatih: ["ganapatih"],
  "savier jasmine": ["savier jasmine"],
};

function normalizeCompanyKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function stripCompanyPrefix(name: string): string {
  return normalizeCompanyKey(name).replace(/^(pt|cv|ud|pd)\s+/, "");
}

function parseArgs(argv: string[]) {
  return { apply: argv.includes("--apply") };
}

function findSourceClient(
  targetName: string,
  sourceByKey: Map<string, { id: string; name: string; logo: string }>,
) {
  const exact = normalizeCompanyKey(targetName);
  const stripped = stripCompanyPrefix(targetName);
  const aliasKeys = NAME_ALIASES[exact] ?? NAME_ALIASES[stripped] ?? [];

  const candidates = [
    exact,
    stripped,
    ...aliasKeys.map(normalizeCompanyKey),
    ...aliasKeys.map(stripCompanyPrefix),
  ];

  for (const key of candidates) {
    const hit = sourceByKey.get(key);
    if (hit?.logo.trim()) {
      return hit;
    }
  }

  // Conservative contains match (min 5 chars) against source keys.
  if (stripped.length >= 5) {
    for (const [key, value] of sourceByKey) {
      if (!value.logo.trim()) {
        continue;
      }
      if (key.includes(stripped) || stripped.includes(key)) {
        return value;
      }
    }
  }

  return null;
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";

  console.log(`[${mode}] copy logos ${SOURCE_BRAND} → ${TARGET_BRAND}`);

  const [sourceClients, targetClients] = await Promise.all([
    getClients(SOURCE_BRAND),
    getClients(TARGET_BRAND),
  ]);

  const sourceByKey = new Map<
    string,
    { id: string; name: string; logo: string }
  >();
  for (const client of sourceClients) {
    if (!client.logo.trim()) {
      continue;
    }
    const entry = { id: client.id, name: client.name, logo: client.logo };
    sourceByKey.set(normalizeCompanyKey(client.name), entry);
    sourceByKey.set(stripCompanyPrefix(client.name), entry);
  }

  console.log(
    `source with logo=${[...sourceByKey.values()].length} unique keys=${sourceByKey.size}`,
  );
  console.log(`target clients=${targetClients.length}`);

  let matched = 0;
  let patched = 0;
  let unchanged = 0;
  let unmatched = 0;

  for (const client of targetClients) {
    const source = findSourceClient(client.name, sourceByKey);
    if (!source) {
      unmatched += 1;
      console.log(`  · no match: ${client.name}`);
      continue;
    }

    matched += 1;
    if (client.logo.trim() === source.logo.trim()) {
      unchanged += 1;
      console.log(`  = same: ${client.name} ← ${source.name}`);
      continue;
    }

    console.log(`  ~ copy: ${client.name} ← ${source.name}`);
    console.log(`      ${source.logo}`);

    if (!apply) {
      continue;
    }

    await updateClient(TARGET_BRAND, client.id, {
      name: client.name,
      logo: source.logo,
      website: client.website,
      description: client.description,
      featured: client.featured,
      testimonials: client.testimonials,
      photos: client.photos,
    });
    patched += 1;
  }

  console.log("\n--- result ---");
  console.log(
    `matched=${matched} patched=${patched} unchanged=${unchanged} unmatched=${unmatched}`,
  );

  if (!apply) {
    console.log("\nDry-run only. Re-run with --apply to write.");
  } else {
    console.log("Done.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
