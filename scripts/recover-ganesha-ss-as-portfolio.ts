/**
 * Recover 11 ganesha-consulting clients deleted after SS previews were
 * mistaken for logos, and convert mis-set preview/Porto logos into portfolio.
 *
 * Source of truth: legacy dump `database-backup/_inspect-ganesha/3584.dat` (Project).
 *
 * Rules:
 * - Project `preview` → portfolio.coverImage only (never client.logo)
 * - client.logo cleared when it looks like a screenshot/preview
 * - real company logos (`/company_logos/`) are left alone
 *
 * Usage:
 *   npx tsx scripts/recover-ganesha-ss-as-portfolio.ts           # dry-run
 *   npx tsx scripts/recover-ganesha-ss-as-portfolio.ts --apply   # write
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, getClients, updateClient } from "../lib/db/clients";
import { createPortfolio, getPortfolioItems } from "../lib/db/portfolio";
import { isCompanyLogoIcon } from "../lib/clients/logo";
import type { PortfolioWorkType } from "../types/portfolio";

const BRAND_ID = "ganesha-consulting";
const DUMP_PROJECTS = "3584.dat";

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
      if (next === "n") {
        out += "\n";
        i += 1;
        continue;
      }
      if (next === "t") {
        out += "\t";
        i += 1;
        continue;
      }
      if (next === "r") {
        out += "\r";
        i += 1;
        continue;
      }
      if (next === "\\") {
        out += "\\";
        i += 1;
        continue;
      }
      out += next;
      i += 1;
      continue;
    }
    out += char;
  }
  return out;
}

function parseCopyRows(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split("\n")) {
    if (!line || line === "\\.") {
      continue;
    }
    const fields: string[] = [];
    let current = "";
    for (let i = 0; i < line.length; i += 1) {
      if (line[i] === "\t") {
        fields.push(current);
        current = "";
        continue;
      }
      current += line[i];
    }
    fields.push(current);
    rows.push(fields.map((field) => unescapeCopyField(field) ?? ""));
  }
  return rows;
}

function normalizeCompanyKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function isScreenshotOrPreview(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }
  return (
    /\/Porto\//i.test(trimmed) ||
    /ganesha_cms_project_previews/i.test(trimmed) ||
    /\/project_previews\//i.test(trimmed)
  );
}

function inferWorkType(url: string): PortfolioWorkType {
  const lower = url.toLowerCase();
  if (
    lower.includes("instagram.com") ||
    lower.includes("tiktok.com") ||
    lower.includes("facebook.com") ||
    lower.includes("linkedin.com")
  ) {
    return "social-media";
  }
  return "website";
}

async function main() {
  const { apply, dumpDir } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";
  const projectsPath = path.join(dumpDir, DUMP_PROJECTS);
  const projectRows = parseCopyRows(await readFile(projectsPath, "utf-8"));

  console.log(`[${mode}] brand=${BRAND_ID}`);
  console.log(`[${mode}] projects=${projectsPath} (${projectRows.length})`);

  const existingClients = await getClients(BRAND_ID);
  const existingPortfolio = await getPortfolioItems(BRAND_ID);
  const clientIdByCompany = new Map(
    existingClients.map((client) => [
      normalizeCompanyKey(client.name),
      client.id,
    ]),
  );

  let clientsRestored = 0;
  let logosCleared = 0;
  let portfolioInserted = 0;
  let portfolioSkipped = 0;

  // 1) Restore missing project clients + ensure portfolio covers from preview.
  for (const row of projectRows) {
    const title = (row[1] ?? "").trim();
    const companyName = (row[2] ?? "").trim();
    const url = (row[3] ?? "").trim();
    const preview = (row[4] ?? "").trim();

    if (!companyName || !title) {
      continue;
    }

    const key = normalizeCompanyKey(companyName);
    let clientId = clientIdByCompany.get(key);

    if (!clientId) {
      console.log(`  + restore client: ${companyName}`);
      if (apply) {
        const created = await createClient(BRAND_ID, {
          name: companyName,
          logo: "",
          website: url,
          description: "",
          featured: false,
          testimonials: [],
          photos: [],
        });
        clientId = created.id;
        clientIdByCompany.set(key, clientId);
      } else {
        clientId = `dry-run:${key}`;
        clientIdByCompany.set(key, clientId);
      }
      clientsRestored += 1;
    }

    const alreadyHasWork = existingPortfolio.some(
      (item) =>
        item.clientId === clientId ||
        (normalizeCompanyKey(item.title) === normalizeCompanyKey(title) &&
          item.url === url),
    );

    if (alreadyHasWork || !preview) {
      portfolioSkipped += 1;
      continue;
    }

    console.log(`  + portfolio: ${title} ← ${companyName}`);
    if (apply && !clientId.startsWith("dry-run:")) {
      await createPortfolio(BRAND_ID, {
        title,
        clientId,
        workType: inferWorkType(url),
        coverImage: preview,
        description: companyName,
        url,
        featured: false,
      });
    }
    portfolioInserted += 1;
  }

  // 2) Clear screenshot/preview URLs wrongly stored as client.logo.
  const clientsNow = apply ? await getClients(BRAND_ID) : existingClients;
  for (const client of clientsNow) {
    if (!isScreenshotOrPreview(client.logo)) {
      continue;
    }
    if (isCompanyLogoIcon(client.logo)) {
      continue;
    }

    console.log(`  ~ clear SS logo: ${client.name}`);
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
    logosCleared += 1;
  }

  // 3) Same SS-as-logo cleanup for gonline (webWorks seeder used ImagePreview as logo).
  const gonlineClients = await getClients("gonline");
  let gonlineLogosCleared = 0;
  for (const client of gonlineClients) {
    if (!isScreenshotOrPreview(client.logo) || isCompanyLogoIcon(client.logo)) {
      continue;
    }
    console.log(`  ~ clear gonline SS logo: ${client.name}`);
    if (apply) {
      await updateClient("gonline", client.id, {
        name: client.name,
        logo: "",
        website: client.website,
        description: client.description,
        featured: client.featured,
        testimonials: client.testimonials,
        photos: client.photos.filter(
          (photo) => !isScreenshotOrPreview(photo.url),
        ),
      });
    }
    gonlineLogosCleared += 1;
  }

  console.log("\n--- result ---");
  console.log(`clients restored=${clientsRestored}`);
  console.log(`portfolio inserted=${portfolioInserted} skipped=${portfolioSkipped}`);
  console.log(`ganesha SS logos cleared=${logosCleared}`);
  console.log(`gonline SS logos cleared=${gonlineLogosCleared}`);

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
