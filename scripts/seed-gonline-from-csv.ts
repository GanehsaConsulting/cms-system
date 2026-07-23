/**
 * Seed brand `gonline` from legacy CMS CSV exports.
 *
 * Sources (default dir: database-backup/gonline):
 * - DB PRODUCTION GONLINE - article.csv  → article categories + articles (Postgres)
 * - DB PRODUCTION GONLINE - ads.csv      → banners (Postgres)
 * - DB PRODUCTION GONLINE - webWorks.csv → clients + portfolio (Postgres)
 *
 * Prices are synced separately:
 *   npx tsx scripts/sync-gonline-prices.ts --apply
 *
 * Usage:
 *   npx tsx scripts/seed-gonline-from-csv.ts           # dry-run
 *   npx tsx scripts/seed-gonline-from-csv.ts --apply   # write
 *
 * Optional:
 *   --dir database-backup/gonline
 *   --brand gonline
 *   --wa-phone 6285117388880   # used when ads.href is a WhatsApp message (not a URL)
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { getCustomCategoryBadgeClass } from "../config/article-category-styles";
import { slugify, slugifyArticleTitle } from "../lib/articles/slug";
import { createBanner, getBanners } from "../lib/db/banners";
import { createClient, getClients } from "../lib/db/clients";
import { db } from "../lib/db/client";
import { createPortfolio, getPortfolioItems } from "../lib/db/portfolio";
import { articleCategories, articles } from "../lib/db/schema";
import { buildWhatsAppUrl } from "../lib/prices/whatsapp";

const BRAND_DEFAULT = "gonline";
/** Official GONLINE WhatsApp from gonline.id schema.org. */
const WA_PHONE_DEFAULT = "6285117388880";

const CSV_FILES = {
  articles: "DB PRODUCTION GONLINE - article.csv",
  ads: "DB PRODUCTION GONLINE - ads.csv",
  webWorks: "DB PRODUCTION GONLINE - webWorks.csv",
} as const;

function parseArgs(argv: string[]) {
  const apply = argv.includes("--apply");
  const brandIdx = argv.indexOf("--brand");
  const dirIdx = argv.indexOf("--dir");
  const waIdx = argv.indexOf("--wa-phone");

  return {
    apply,
    brandId:
      brandIdx >= 0 && argv[brandIdx + 1]
        ? argv[brandIdx + 1].trim()
        : BRAND_DEFAULT,
    csvDir:
      dirIdx >= 0 && argv[dirIdx + 1]
        ? path.resolve(argv[dirIdx + 1])
        : path.join(process.cwd(), "database-backup/gonline"),
    waPhone:
      waIdx >= 0 && argv[waIdx + 1]
        ? argv[waIdx + 1].replace(/\D/g, "")
        : WA_PHONE_DEFAULT,
  };
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

async function loadCsvObjects(filePath: string) {
  const text = await readFile(filePath, "utf-8");
  return rowsToObjects(parseCsv(text));
}

function parseBool(value: string): boolean {
  const normalized = value.trim().toUpperCase();
  return normalized === "TRUE" || normalized === "1" || normalized === "YES";
}

/** Legacy sheet dates like `3/17/2026 14:45:33` (US) or ISO. */
function parseSheetDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const usMatch = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (usMatch) {
    const month = Number(usMatch[1]);
    const day = Number(usMatch[2]);
    const year = Number(usMatch[3]);
    const hour = Number(usMatch[4] ?? "0");
    const minute = Number(usMatch[5] ?? "0");
    const second = Number(usMatch[6] ?? "0");
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function stripHtmlExcerpt(html: string, max = 220): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function parseTags(raw: string): string[] {
  return raw
    .split(/[;,]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function normalizeCompanyKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveAdRedirect(href: string, waPhone: string): string {
  const trimmed = href.trim();
  if (!trimmed) {
    return buildWhatsAppUrl(waPhone, "");
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("whatsapp://")) {
    return trimmed;
  }

  return buildWhatsAppUrl(waPhone, trimmed);
}

async function main() {
  const { apply, brandId, csvDir, waPhone } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";

  console.log(`[${mode}] brand=${brandId}`);
  console.log(`[${mode}] csvDir=${csvDir}`);
  console.log(`[${mode}] waPhone=${waPhone}`);

  const [rawArticleRows, adRows, workRows] = await Promise.all([
    loadCsvObjects(path.join(csvDir, CSV_FILES.articles)),
    loadCsvObjects(path.join(csvDir, CSV_FILES.ads)),
    loadCsvObjects(path.join(csvDir, CSV_FILES.webWorks)),
  ]);

  const articleRows = rawArticleRows.filter((row) => (row.title ?? "").trim());

  const categoryLabels = [
    ...new Set(
      articleRows
        .map((row) => row.category?.trim() ?? "")
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const categories = categoryLabels.map((label, index) => ({
    id: slugify(label) || `category-${index + 1}`,
    label,
  }));

  const sortedAds = [...adRows].sort(
    (a, b) =>
      Number.parseInt(b.priority || "0", 10) -
      Number.parseInt(a.priority || "0", 10),
  );

  console.log("--- plan ---");
  console.log(`article categories: ${categories.length}`);
  for (const category of categories) {
    console.log(`  + ${category.id} (${category.label})`);
  }
  console.log(`articles: ${articleRows.length}`);
  for (const row of articleRows) {
    const slug = slugifyArticleTitle(row.title || `article-${row.id}`);
    console.log(
      `  + ${slug} — ${row.title || "(untitled)"} [${row.status || "draft"}]`,
    );
  }
  console.log(`ads → banners: ${sortedAds.length}`);
  for (const ad of sortedAds) {
    console.log(
      `  + ad-${ad.id} (priority ${ad.priority}) → ${ad.image.slice(0, 60)}…`,
    );
  }
  console.log(`webWorks → clients/portfolio: ${workRows.length}`);
  for (const work of workRows) {
    console.log(`  + ${work.CompanyName || work.BrandName} — ${work.Link}`);
  }
  console.log(
    "prices: use `npx tsx scripts/sync-gonline-prices.ts --apply` (canonical catalog)",
  );

  if (!apply) {
    console.log(
      "\nDry-run only. Re-run with --apply to write Postgres.",
    );
    return;
  }

  let categoriesInserted = 0;
  let categoriesSkipped = 0;
  for (const [index, category] of categories.entries()) {
    const existing = await db
      .select({ id: articleCategories.id })
      .from(articleCategories)
      .where(
        and(
          eq(articleCategories.brandId, brandId),
          eq(articleCategories.id, category.id),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      categoriesSkipped += 1;
      continue;
    }

    await db.insert(articleCategories).values({
      id: category.id,
      brandId,
      label: category.label,
      badgeClassName: getCustomCategoryBadgeClass(index),
      createdAt: new Date(),
    });
    categoriesInserted += 1;
  }

  let articlesInserted = 0;
  let articlesSkipped = 0;

  for (const row of articleRows) {
    const title = (row.title ?? "").trim();
    if (!title) {
      articlesSkipped += 1;
      continue;
    }

    const slug = slugifyArticleTitle(title) || `article-${row.id}`;
    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.brandId, brandId), eq(articles.slug, slug)))
      .limit(1);

    if (existing.length > 0) {
      articlesSkipped += 1;
      continue;
    }

    const content = row.content ?? "";
    const excerpt = (row.excerpt ?? "").trim() || stripHtmlExcerpt(content);
    const categoryLabel = (row.category ?? "").trim();
    const category = categoryLabel ? slugify(categoryLabel) || "general" : "general";
    const status = parseBool(row.status) ? "published" : "draft";
    const now = new Date();
    const createdAt = parseSheetDate(row.createdAt) ?? now;
    const updatedAt = parseSheetDate(row.updatedAt) ?? createdAt;
    const tags = parseTags(row.tags ?? "");

    await db.insert(articles).values({
      id: crypto.randomUUID(),
      brandId,
      title,
      slug,
      excerpt,
      content,
      status,
      authorName: "Gonline",
      authorId: null,
      category,
      tags,
      metaTitle: "",
      metaDescription: excerpt,
      highlighted: parseBool(row.highlight),
      gallery: [],
      thumbnail: (row.coverImage ?? "").trim(),
      publishedAt: status === "published" ? updatedAt : null,
      createdAt,
      updatedAt,
    });
    articlesInserted += 1;
  }

  const existingClients = await getClients(brandId);
  const clientIdByCompany = new Map(
    existingClients.map((client) => [
      normalizeCompanyKey(client.name),
      client.id,
    ]),
  );
  let clientsInserted = 0;
  let clientsSkipped = 0;

  for (const work of workRows) {
    const name = (work.CompanyName || work.BrandName || "").trim();
    const logo = (work.ImagePreview ?? "").trim();
    if (!name) {
      clientsSkipped += 1;
      continue;
    }

    const key = normalizeCompanyKey(name);
    if (clientIdByCompany.has(key)) {
      clientsSkipped += 1;
      continue;
    }

    const features = (work.Features ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" · ");
    const kind = (work.Kind ?? "").trim();
    const category = (work.Category ?? "").trim();
    const description = [kind, category, features].filter(Boolean).join(" — ");

    const created = await createClient(brandId, {
      name,
      logo,
      website: (work.Link ?? "").trim(),
      description,
      featured: false,
      testimonials: [],
      photos: logo
        ? [
            {
              id: crypto.randomUUID(),
              url: logo,
              caption: (work.BrandName || name).trim(),
            },
          ]
        : [],
    });
    clientIdByCompany.set(key, created.id);
    clientsInserted += 1;
  }

  const existingPortfolio = await getPortfolioItems(brandId);
  const existingPortfolioKeys = new Set(
    existingPortfolio.map(
      (item) => `${normalizeCompanyKey(item.title)}|${item.url}`,
    ),
  );
  let portfolioInserted = 0;
  let portfolioSkipped = 0;

  for (const work of workRows) {
    const companyName = (work.CompanyName || "").trim();
    const title = (work.BrandName || companyName).trim();
    const url = (work.Link ?? "").trim();
    const coverImage = (work.ImagePreview ?? "").trim();

    if (!title || !companyName) {
      portfolioSkipped += 1;
      continue;
    }

    const clientId = clientIdByCompany.get(normalizeCompanyKey(companyName));
    if (!clientId) {
      portfolioSkipped += 1;
      continue;
    }

    const dedupeKey = `${normalizeCompanyKey(title)}|${url}`;
    if (existingPortfolioKeys.has(dedupeKey)) {
      portfolioSkipped += 1;
      continue;
    }

    const features = (work.Features ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" · ");

    await createPortfolio(brandId, {
      title,
      clientId,
      workType: "website",
      coverImage,
      description: features || (work.Kind ?? "").trim() || companyName,
      url,
      featured: false,
    });
    existingPortfolioKeys.add(dedupeKey);
    portfolioInserted += 1;
  }

  const existingBanners = await getBanners(brandId);
  const existingBannerKeys = new Set(existingBanners.map((item) => item.key));
  let bannersInserted = 0;
  let bannersSkipped = 0;

  for (const ad of sortedAds) {
    const image = (ad.image ?? "").trim();
    if (!image) {
      bannersSkipped += 1;
      continue;
    }

    const key = `ad-${ad.id}`;
    if (existingBannerKeys.has(key)) {
      bannersSkipped += 1;
      continue;
    }

    await createBanner(brandId, {
      name: `Gonline Ad ${ad.id}`,
      key,
      images: [image],
      redirectUrl: resolveAdRedirect(ad.href ?? "", waPhone),
      isActive: parseBool(ad.status ?? "TRUE"),
    });
    existingBannerKeys.add(key);
    bannersInserted += 1;
  }

  if (sortedAds.length > 0 && !existingBannerKeys.has("homepage")) {
    const images = sortedAds
      .map((ad) => (ad.image ?? "").trim())
      .filter(Boolean);
    if (images.length > 0) {
      await createBanner(brandId, {
        name: "Homepage Hero",
        key: "homepage",
        images,
        redirectUrl: resolveAdRedirect(sortedAds[0]?.href ?? "", waPhone),
        isActive: true,
      });
      existingBannerKeys.add("homepage");
      bannersInserted += 1;
    }
  }

  console.log("\n--- result ---");
  console.log(
    `article categories: inserted=${categoriesInserted} skipped=${categoriesSkipped}`,
  );
  console.log(
    `articles: inserted=${articlesInserted} skipped=${articlesSkipped}`,
  );
  console.log(`clients: inserted=${clientsInserted} skipped=${clientsSkipped}`);
  console.log(
    `portfolio: inserted=${portfolioInserted} skipped=${portfolioSkipped}`,
  );
  console.log(`banners: inserted=${bannersInserted} skipped=${bannersSkipped}`);
  console.log("Done.");
  console.log(
    "\nPrices: run `npx tsx scripts/sync-gonline-prices.ts --apply` if needed.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
