/**
 * Patch GONLINE client logos from Ganesha dump + existing ganesha clients.
 *
 * Sources (prefer company_logos URLs):
 * 1. Testimonial.companyLogo — database-backup/_inspect-ganesha/3592.dat
 * 2. Project.preview keyed by companyName + project name — 3584.dat
 * 3. Existing cms.clients for brand ganesha-consulting
 *
 * Usage:
 *   npx tsx scripts/sync-gonline-client-logos-from-ganesha.ts           # dry-run
 *   npx tsx scripts/sync-gonline-client-logos-from-ganesha.ts --apply    # write
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getClients, updateClient } from "../lib/db/clients";

const TARGET_BRAND = "gonline";
const SOURCE_BRAND = "ganesha-consulting";
const TESTIMONIALS_FILE = "3592.dat";
const PROJECTS_FILE = "3584.dat";

/** Explicit gonline name → possible source names. */
const NAME_ALIASES: Record<string, string[]> = {
  gab: ["pt gab dig jaya", "gab"],
  lpk: ["pt lpk hidamari kenshu senta", "lpk"],
  medlife: ["pt medlife abadi jaya", "medlife"],
  "bharata fresh": [
    "pt bharata alam sentosa",
    "bharata fresh",
    "bharata fresh bali",
  ],
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
  "pt lentera berkat wisesa": [
    "pt lentera berkat wisesa",
    "lbw",
  ],
  "pt ems": ["pt elka mitra sejahtera", "ems"],
  "jma indonesia": ["cv jelita makmur abadi", "jma indonesia", "jma"],
  seic: ["seic"],
  ganapatih: ["ganapatih"],
  "savier jasmine": ["savier jasmine"],
  "d racing": ["pt dlapan djalan raya", "d racing", "pt delapan djalan raya"],
  kalanesia: ["pt kedaulatan alam indonesia", "kalanesia"],
};

function parseArgs(argv: string[]) {
  const apply = argv.includes("--apply");
  const dirIdx = argv.indexOf("--dir");
  const dumpDir =
    dirIdx >= 0 && argv[dirIdx + 1]
      ? path.resolve(argv[dirIdx + 1])
      : path.join(process.cwd(), "database-backup/_inspect-ganesha");
  return { apply, dumpDir };
}

function unescapeCopyField(field: string): string | null {
  if (field === "\\N") {
    return null;
  }

  let out = "";
  for (let i = 0; i < field.length; i += 1) {
    const char = field[i];
    if (char === "\\" && i + 1 < field.length) {
      const next = field[i + 1];
      const mapped: Record<string, string> = {
        n: "\n",
        r: "\r",
        t: "\t",
        b: "\b",
        f: "\f",
        v: "\v",
        "\\": "\\",
      };
      out += mapped[next] ?? next;
      i += 1;
      continue;
    }
    out += char;
  }

  return out;
}

async function parseCopyFile(
  filePath: string,
  expectedCols: number,
): Promise<(string | null)[][]> {
  const text = await readFile(filePath, "utf-8");
  const rows: (string | null)[][] = [];

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim() === "\\.") {
      continue;
    }

    const fields = line.split("\t").map(unescapeCopyField);
    if (fields.length !== expectedCols) {
      continue;
    }
    rows.push(fields);
  }

  return rows;
}

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

function isUsableCompanyName(name: string): boolean {
  const normalized = normalizeCompanyKey(name);
  return Boolean(normalized) && normalized !== "-" && normalized !== "—";
}

function logoScore(url: string): number {
  const lower = url.toLowerCase();
  if (lower.includes("company_logos")) {
    return 4;
  }
  if (lower.includes("ganesha_cms_clients")) {
    return 3;
  }
  if (lower.includes("ganesha_cms_project_previews")) {
    return 2;
  }
  if (lower.includes("cloudinary")) {
    return 1;
  }
  return 0;
}

type LogoEntry = { name: string; logo: string };

function putLogo(
  map: Map<string, LogoEntry>,
  rawName: string,
  logo: string,
) {
  if (!isUsableCompanyName(rawName) || !logo.trim()) {
    return;
  }

  const entry = { name: rawName.trim(), logo: logo.trim() };
  for (const key of [
    normalizeCompanyKey(rawName),
    stripCompanyPrefix(rawName),
  ]) {
    const current = map.get(key);
    if (!current || logoScore(entry.logo) >= logoScore(current.logo)) {
      map.set(key, entry);
    }
  }
}

function buildLogoMapFromTestimonials(
  rows: (string | null)[][],
  map: Map<string, LogoEntry>,
) {
  for (const row of rows) {
    const clientPhoto = (row[1] ?? "").trim();
    const companyLogo = (row[2] ?? "").trim();
    const clientName = (row[3] ?? "").trim();
    const companyName = (row[4] ?? "").trim();
    const logo = companyLogo || clientPhoto;
    const displayName = isUsableCompanyName(companyName)
      ? companyName
      : isUsableCompanyName(clientName)
        ? clientName
        : "";
    putLogo(map, displayName, logo);
  }
}

function buildLogoMapFromProjects(
  rows: (string | null)[][],
  map: Map<string, LogoEntry>,
) {
  for (const row of rows) {
    const projectName = (row[1] ?? "").trim();
    const companyName = (row[2] ?? "").trim();
    const preview = (row[4] ?? "").trim();
    putLogo(map, companyName, preview);
    putLogo(map, projectName, preview);
  }
}

function findLogoForClient(
  clientName: string,
  logoMap: Map<string, LogoEntry>,
): LogoEntry | null {
  const exact = normalizeCompanyKey(clientName);
  const stripped = stripCompanyPrefix(clientName);
  const aliasKeys = NAME_ALIASES[exact] ?? NAME_ALIASES[stripped] ?? [];
  const candidates = [
    exact,
    stripped,
    ...aliasKeys.map((alias) => normalizeCompanyKey(alias)),
    ...aliasKeys.map((alias) => stripCompanyPrefix(alias)),
  ];

  let best: LogoEntry | null = null;
  for (const key of candidates) {
    const hit = logoMap.get(key);
    if (!hit) {
      continue;
    }
    if (!best || logoScore(hit.logo) > logoScore(best.logo)) {
      best = hit;
    }
  }

  return best;
}

async function main() {
  const { apply, dumpDir } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";

  console.log(`[${mode}] target brand=${TARGET_BRAND}`);
  console.log(`[${mode}] dump=${dumpDir}`);

  const [testimonialRows, projectRows, ganeshaClients, gonlineClients] =
    await Promise.all([
      parseCopyFile(path.join(dumpDir, TESTIMONIALS_FILE), 11),
      parseCopyFile(path.join(dumpDir, PROJECTS_FILE), 8),
      getClients(SOURCE_BRAND),
      getClients(TARGET_BRAND),
    ]);

  const logoMap = new Map<string, LogoEntry>();
  buildLogoMapFromTestimonials(testimonialRows, logoMap);
  buildLogoMapFromProjects(projectRows, logoMap);
  for (const client of ganeshaClients) {
    putLogo(logoMap, client.name, client.logo);
  }

  console.log(`logo keys: ${logoMap.size}`);
  console.log(`gonline clients: ${gonlineClients.length}`);

  let matched = 0;
  let patched = 0;
  let unchanged = 0;
  let unmatched = 0;

  for (const client of gonlineClients) {
    const hit = findLogoForClient(client.name, logoMap);
    if (!hit) {
      unmatched += 1;
      console.log(`  · no match: ${client.name}`);
      continue;
    }

    matched += 1;
    if (client.logo.trim() === hit.logo) {
      unchanged += 1;
      console.log(`  = same: ${client.name} ← ${hit.name}`);
      continue;
    }

    console.log(`  ~ patch: ${client.name} ← ${hit.name}`);
    console.log(`      ${hit.logo}`);

    if (!apply) {
      continue;
    }

    await updateClient(TARGET_BRAND, client.id, {
      name: client.name,
      logo: hit.logo,
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
    console.log("\nDry-run only. Re-run with --apply to write logos.");
  } else {
    console.log("Done.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
