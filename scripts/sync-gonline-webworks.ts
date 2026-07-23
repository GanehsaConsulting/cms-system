/**
 * Sync GONLINE clients + portfolio from webWorks.csv into Postgres.
 * Replaces existing gonline clients/portfolio so CSV is the source of truth.
 *
 * Usage:
 *   npx tsx scripts/sync-gonline-webworks.ts           # dry-run
 *   npx tsx scripts/sync-gonline-webworks.ts --apply    # write
 *
 * Optional:
 *   --dir database-backup/gonline
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { createClient } from "../lib/db/clients";
import { db } from "../lib/db/client";
import { createPortfolio } from "../lib/db/portfolio";
import { clients, portfolio } from "../lib/db/schema";

const BRAND_ID = "gonline";
const CSV_NAME = "DB PRODUCTION GONLINE - webWorks.csv";

function parseArgs(argv: string[]) {
  const apply = argv.includes("--apply");
  const dirIdx = argv.indexOf("--dir");
  const csvDir =
    dirIdx >= 0 && argv[dirIdx + 1]
      ? path.resolve(argv[dirIdx + 1])
      : path.join(process.cwd(), "database-backup/gonline");
  return { apply, csvDir };
}

/** Minimal RFC4180 CSV parser (handles quoted multiline fields). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
        continue;
      }
      if (char === '"') {
        inQuotes = false;
        continue;
      }
      field += char;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim().length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    if (char === "\r") {
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((cell) => cell.trim().length > 0)) {
    rows.push(row);
  }

  return rows;
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((cells) => {
    const item: Record<string, string> = {};
    for (let i = 0; i < headers.length; i += 1) {
      item[headers[i]] = (cells[i] ?? "").trim();
    }
    return item;
  });
}

function normalizeCompanyKey(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

async function main() {
  const { apply, csvDir } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";
  const csvPath = path.join(csvDir, CSV_NAME);
  const text = await readFile(csvPath, "utf-8");
  const workRows = rowsToObjects(parseCsv(text)).filter(
    (row) => (row.CompanyName || row.BrandName || "").trim().length > 0,
  );

  console.log(`[${mode}] brand=${BRAND_ID}`);
  console.log(`[${mode}] csv=${csvPath}`);
  console.log(`rows: ${workRows.length}`);
  for (const work of workRows) {
    console.log(
      `  + client=${work.CompanyName} | work=${work.BrandName || work.CompanyName} | ${work.Link}`,
    );
  }

  if (!apply) {
    console.log("\nDry-run only. Re-run with --apply to replace GONLINE clients + portfolio.");
    return;
  }

  // Portfolio first (FK-style dependency on client ids), then clients.
  await db.delete(portfolio).where(eq(portfolio.brandId, BRAND_ID));
  await db.delete(clients).where(eq(clients.brandId, BRAND_ID));

  const clientIdByCompany = new Map<string, string>();
  let clientsInserted = 0;
  let portfolioInserted = 0;
  let skipped = 0;

  for (const work of workRows) {
    const companyName = (work.CompanyName || work.BrandName || "").trim();
    const workTitle = (work.BrandName || companyName).trim();
    const logo = (work.ImagePreview ?? "").trim();
    const url = (work.Link ?? "").trim();
    const features = (work.Features ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" · ");
    const kind = (work.Kind ?? "").trim();
    const category = (work.Category ?? "").trim();
    const description = [kind, category, features].filter(Boolean).join(" — ");

    if (!companyName) {
      skipped += 1;
      continue;
    }

    const companyKey = normalizeCompanyKey(companyName);
    let clientId = clientIdByCompany.get(companyKey);

    if (!clientId) {
      const created = await createClient(BRAND_ID, {
        name: companyName,
        logo,
        website: url,
        description,
        featured: false,
        testimonials: [],
        photos: logo
          ? [
              {
                id: crypto.randomUUID(),
                url: logo,
                caption: workTitle,
              },
            ]
          : [],
      });
      clientId = created.id;
      clientIdByCompany.set(companyKey, clientId);
      clientsInserted += 1;
    }

    await createPortfolio(BRAND_ID, {
      title: workTitle,
      clientId,
      workType: "website",
      coverImage: logo,
      description: description || companyName,
      url,
      featured: false,
    });
    portfolioInserted += 1;
  }

  console.log("\n--- result ---");
  console.log(`clients inserted=${clientsInserted}`);
  console.log(`portfolio inserted=${portfolioInserted}`);
  console.log(`skipped=${skipped}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
