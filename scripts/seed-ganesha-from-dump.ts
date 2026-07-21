/**
 * ETL from legacy Ganesha Consulting pg_dump (directory format) → current CMS.
 *
 * Does NOT run pg_restore. Maps Prisma `myschema` tables into:
 * - Postgres `cms.article_categories` + `cms.articles`
 * - JSON: price-categories, prices, clients, portfolio, banners
 *
 * Usage:
 *   npx tsx scripts/seed-ganesha-from-dump.ts           # dry-run
 *   npx tsx scripts/seed-ganesha-from-dump.ts --apply   # write
 *
 * Optional:
 *   --dir database-backup/_inspect-ganesha
 *   --brand ganesha-consulting
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
import {
  createPriceCategory,
  getPriceCategories,
} from "../lib/db/price-categories";
import { createPrice, getPrices } from "../lib/db/prices";
import { createPortfolio, getPortfolioItems } from "../lib/db/portfolio";
import { articleCategories, articles } from "../lib/db/schema";
import { emptyLocalizedText } from "../lib/locale";
import {
  extractWhatsAppMessage,
  extractWhatsAppPhone,
} from "../lib/prices/whatsapp";
import type { LocalizedText } from "../types/locale";
import type { PortfolioWorkType } from "../types/portfolio";
import type { PriceFeature } from "../types/price";

const BRAND_DEFAULT = "ganesha-consulting";

/** Filess directory-format dump file map (see restore.sql). */
const DUMP_FILES = {
  articles: "3600.dat",
  categories: "3603.dat",
  features: "3607.dat",
  media: "3609.dat",
  packages: "3611.dat",
  packageFeatures: "3612.dat",
  projects: "3584.dat",
  promos: "3586.dat",
  services: "3590.dat",
  testimonials: "3592.dat",
  users: "3595.dat",
} as const;

function parseArgs(argv: string[]) {
  const apply = argv.includes("--apply");
  const brandIdx = argv.indexOf("--brand");
  const dirIdx = argv.indexOf("--dir");
  const brandId =
    brandIdx >= 0 && argv[brandIdx + 1]
      ? argv[brandIdx + 1].trim()
      : BRAND_DEFAULT;
  const dumpDir =
    dirIdx >= 0 && argv[dirIdx + 1]
      ? path.resolve(argv[dirIdx + 1])
      : path.join(process.cwd(), "database-backup/_inspect-ganesha");

  return { apply, brandId, dumpDir };
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

function parseBool(value: string | null): boolean {
  return value === "t" || value === "true" || value === "1";
}

function parsePgTimestamp(value: string | null): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const iso = trimmed.includes("T")
    ? trimmed
    : `${trimmed.replace(" ", "T")}${trimmed.endsWith("Z") ? "" : "Z"}`;
  const date = new Date(iso);
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

function localize(value: string): LocalizedText {
  return emptyLocalizedText(value.trim());
}

function mapArticleStatus(raw: string | null): "draft" | "published" | "archived" {
  const status = (raw ?? "").trim().toUpperCase();
  if (status === "PUBLISH" || status === "PUBLISHED") {
    return "published";
  }
  if (status === "ARCHIVE" || status === "ARCHIVED") {
    return "archived";
  }
  return "draft";
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

function normalizeCompanyKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function whatsappFromLink(link: string) {
  return {
    whatsappPhone: extractWhatsAppPhone(link),
    whatsappMessage: localize(extractWhatsAppMessage(link) || ""),
  };
}

async function main() {
  const { apply, brandId, dumpDir } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";

  console.log(`[${mode}] brand=${brandId}`);
  console.log(`[${mode}] dumpDir=${dumpDir}`);

  const [
    categoryRows,
    userRows,
    articleRows,
    mediaRows,
    serviceRows,
    packageRows,
    packageFeatureRows,
    featureRows,
    testimonialRows,
    projectRows,
    promoRows,
  ] = await Promise.all([
    parseCopyFile(path.join(dumpDir, DUMP_FILES.categories), 5),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.users), 7),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.articles), 12),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.media), 10),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.services), 6),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.packages), 10),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.packageFeatures), 3),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.features), 4),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.testimonials), 11),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.projects), 8),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.promos), 7),
  ]);

  const authors = new Map(
    userRows.map((row) => [row[0]!, { name: (row[2] ?? "Author").trim() }]),
  );
  const mediaById = new Map(
    mediaRows.map((row) => [row[0]!, { url: (row[1] ?? "").trim() }]),
  );

  const categories = categoryRows.map((row) => {
    const label = (row[1] ?? "").trim();
    const rawSlug = (row[2] ?? "").trim();
    const id = slugify(rawSlug || label);
    return { id, label, legacyId: row[0]! };
  });
  const categoryByLegacyId = new Map(
    categories.map((category) => [category.legacyId, category.id]),
  );

  const services = serviceRows.map((row) => ({
    legacyId: row[0]!,
    name: (row[1] ?? "").trim(),
    slug: slugify((row[2] ?? "").trim() || (row[1] ?? "").trim()),
    description: (row[3] ?? "").trim(),
  }));
  const serviceByLegacyId = new Map(
    services.map((service) => [service.legacyId, service]),
  );

  const featureNameById = new Map(
    featureRows.map((row) => [row[0]!, (row[1] ?? "").trim()]),
  );

  const featuresByPackageId = new Map<string, PriceFeature[]>();
  for (const row of packageFeatureRows) {
    if (!parseBool(row[2])) {
      continue;
    }
    const packageId = row[0]!;
    const featureId = row[1]!;
    const name = featureNameById.get(featureId);
    if (!name) {
      continue;
    }
    const list = featuresByPackageId.get(packageId) ?? [];
    list.push({
      id: crypto.randomUUID(),
      name: localize(name),
    });
    featuresByPackageId.set(packageId, list);
  }

  console.log("--- plan ---");
  console.log(`article categories: ${categories.length}`);
  for (const category of categories) {
    console.log(`  + ${category.id} (${category.label})`);
  }
  console.log(`articles: ${articleRows.length}`);
  for (const row of articleRows) {
    console.log(`  + ${row[2]} — ${row[1]}`);
  }
  console.log(`services → price categories: ${services.length}`);
  console.log(`packages → prices: ${packageRows.length}`);
  console.log(`testimonials → clients: ${testimonialRows.length}`);
  console.log(`projects → portfolio: ${projectRows.length}`);
  console.log(`promos → banners: ${promoRows.length}`);

  if (!apply) {
    console.log(
      "\nDry-run only. Re-run with --apply to write Postgres + data/*.json.",
    );
    return;
  }

  let categoriesInserted = 0;
  let categoriesSkipped = 0;
  for (const [index, category] of categories.entries()) {
    if (!category.id || !category.label) {
      categoriesSkipped += 1;
      continue;
    }

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
    const slug = (row[2] ?? "").trim();
    if (!slug) {
      articlesSkipped += 1;
      continue;
    }

    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.brandId, brandId), eq(articles.slug, slug)))
      .limit(1);

    if (existing.length > 0) {
      articlesSkipped += 1;
      continue;
    }

    const content = row[4] ?? "";
    const excerpt =
      (row[3] ?? "").trim() || stripHtmlExcerpt(content);
    const category =
      categoryByLegacyId.get(row[9] ?? "") ?? "general";
    const author = authors.get(row[10] ?? "");
    const thumbnail = mediaById.get(row[11] ?? "")?.url ?? "";
    const now = new Date();
    const createdAt = parsePgTimestamp(row[5]) ?? now;
    const updatedAt = parsePgTimestamp(row[6]) ?? now;
    const status = mapArticleStatus(row[7]);

    await db.insert(articles).values({
      id: crypto.randomUUID(),
      brandId,
      title: (row[1] ?? slug).trim(),
      slug,
      excerpt,
      content,
      status,
      authorName: author?.name || "Ganesha Consulting",
      authorId: null,
      category,
      tags: [],
      metaTitle: "",
      metaDescription: excerpt,
      highlighted: parseBool(row[8]),
      gallery: [],
      thumbnail,
      publishedAt: status === "published" ? updatedAt : null,
      createdAt,
      updatedAt,
    });
    articlesInserted += 1;
  }

  const existingPriceCategories = await getPriceCategories(brandId);
  const existingPriceCategoryIds = new Set(
    existingPriceCategories.map((item) => item.id),
  );
  /** Legacy service id → created price-category id (slugify(label) may differ from dump slug). */
  const priceCategoryIdByServiceLegacyId = new Map<string, string>();

  for (const existing of existingPriceCategories) {
    const match = services.find(
      (service) =>
        service.slug === existing.id ||
        slugify(service.name) === existing.id ||
        service.name.toLowerCase() === existing.label.toLowerCase(),
    );
    if (match) {
      priceCategoryIdByServiceLegacyId.set(match.legacyId, existing.id);
    }
  }

  let priceCategoriesInserted = 0;
  let priceCategoriesSkipped = 0;
  for (const service of services) {
    if (!service.slug || !service.name) {
      priceCategoriesSkipped += 1;
      continue;
    }

    const alreadyMapped = priceCategoryIdByServiceLegacyId.get(service.legacyId);
    if (alreadyMapped) {
      priceCategoriesSkipped += 1;
      continue;
    }

    if (existingPriceCategoryIds.has(service.slug)) {
      priceCategoryIdByServiceLegacyId.set(service.legacyId, service.slug);
      priceCategoriesSkipped += 1;
      continue;
    }

    const created = await createPriceCategory(brandId, {
      label: service.name,
    });
    priceCategoryIdByServiceLegacyId.set(service.legacyId, created.id);
    existingPriceCategoryIds.add(created.id);
    priceCategoriesInserted += 1;
  }

  const existingPrices = await getPrices(brandId);
  const existingPriceSlugs = new Set(existingPrices.map((item) => item.slug));
  let pricesInserted = 0;
  let pricesSkipped = 0;

  const sortedPackages = [...packageRows].sort(
    (a, b) =>
      Number.parseInt(a[0] ?? "0", 10) - Number.parseInt(b[0] ?? "0", 10),
  );

  for (const row of sortedPackages) {
    const packageId = row[0]!;
    const service = serviceByLegacyId.get(row[1] ?? "");
    const packageName = (row[2] ?? "").trim();
    if (!packageName || !service) {
      pricesSkipped += 1;
      continue;
    }

    const categoryId =
      priceCategoryIdByServiceLegacyId.get(service.legacyId) ?? service.slug;

    const slug =
      slugifyArticleTitle(`${categoryId}-${packageName}`, 80) ||
      `package-${packageId}`;

    if (existingPriceSlugs.has(slug)) {
      pricesSkipped += 1;
      continue;
    }

    const link = (row[7] ?? "").trim();
    const wa = whatsappFromLink(link);
    const features = featuresByPackageId.get(packageId) ?? [];

    await createPrice(brandId, {
      slug,
      serviceSlug: categoryId,
      category: categoryId,
      highlighted: parseBool(row[3]),
      description: localize(service.description),
      service: localize(service.name),
      packageName: localize(packageName),
      price: Number.parseInt(row[4] ?? "0", 10) || 0,
      strikethroughPrice: Number.parseInt(row[6] ?? "0", 10) || 0,
      whatsappPhone: wa.whatsappPhone,
      whatsappMessage: wa.whatsappMessage,
      isActive: true,
      features,
    });
    existingPriceSlugs.add(slug);
    pricesInserted += 1;
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

  async function ensureClient(input: {
    name: string;
    logo: string;
    website?: string;
    description?: string;
    testimonials?: {
      quote: string;
      authorName: string;
      authorTitle: string;
    }[];
  }): Promise<string | null> {
    const name = input.name.trim();
    if (!name) {
      return null;
    }

    const key = normalizeCompanyKey(name);
    const existingId = clientIdByCompany.get(key);
    if (existingId) {
      return existingId;
    }

    const created = await createClient(brandId, {
      name,
      logo: input.logo.trim(),
      website: input.website?.trim() ?? "",
      description: input.description?.trim() ?? "",
      featured: false,
      testimonials: (input.testimonials ?? [])
        .filter((item) => item.quote.trim() && item.quote.trim() !== "-")
        .map((item) => ({
          id: crypto.randomUUID(),
          quote: item.quote.trim(),
          authorName: item.authorName.trim() || name,
          authorTitle: item.authorTitle.trim(),
        })),
      photos: [],
    });
    clientIdByCompany.set(key, created.id);
    clientsInserted += 1;
    return created.id;
  }

  for (const row of testimonialRows) {
    const companyName = (row[4] ?? row[3] ?? "").trim();
    const logo = (row[2] ?? "").trim();
    const clientName = (row[3] ?? "").trim();
    const review = (row[5] ?? "").trim();

    if (!companyName) {
      clientsSkipped += 1;
      continue;
    }

    const key = normalizeCompanyKey(companyName);
    if (clientIdByCompany.has(key)) {
      clientsSkipped += 1;
      continue;
    }

    await ensureClient({
      name: companyName,
      logo,
      testimonials: [
        {
          quote: review,
          authorName: clientName || companyName,
          authorTitle: "",
        },
      ],
    });
  }

  for (const row of projectRows) {
    const companyName = (row[2] ?? "").trim();
    const preview = (row[4] ?? "").trim();
    if (!companyName) {
      continue;
    }
    const key = normalizeCompanyKey(companyName);
    if (clientIdByCompany.has(key)) {
      continue;
    }
    await ensureClient({
      name: companyName,
      logo: preview,
      website: (row[3] ?? "").trim(),
    });
  }

  const existingPortfolio = await getPortfolioItems(brandId);
  const existingPortfolioKeys = new Set(
    existingPortfolio.map(
      (item) => `${normalizeCompanyKey(item.title)}|${item.url}`,
    ),
  );
  let portfolioInserted = 0;
  let portfolioSkipped = 0;

  for (const row of projectRows) {
    const title = (row[1] ?? "").trim();
    const companyName = (row[2] ?? "").trim();
    const url = (row[3] ?? "").trim();
    const coverImage = (row[4] ?? "").trim();
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

    await createPortfolio(brandId, {
      title,
      clientId,
      workType: inferWorkType(url),
      coverImage,
      description: companyName,
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

  for (const row of promoRows) {
    const legacyId = row[0]!;
    const redirectUrl = (row[1] ?? "").trim();
    const name = (row[2] ?? `Promo ${legacyId}`).trim();
    const desktop = (row[5] ?? "").trim();
    const mobile = (row[6] ?? "").trim();
    const images = [desktop, mobile].filter(Boolean);
    const key = `promo-${legacyId}`;

    if (images.length === 0) {
      bannersSkipped += 1;
      continue;
    }
    if (existingBannerKeys.has(key)) {
      bannersSkipped += 1;
      continue;
    }

    await createBanner(brandId, {
      name,
      key,
      images,
      redirectUrl,
      isActive: true,
    });
    existingBannerKeys.add(key);
    bannersInserted += 1;
  }

  console.log("\n--- result ---");
  console.log(
    `article categories: inserted=${categoriesInserted} skipped=${categoriesSkipped}`,
  );
  console.log(
    `articles: inserted=${articlesInserted} skipped=${articlesSkipped}`,
  );
  console.log(
    `price categories: inserted=${priceCategoriesInserted} skipped=${priceCategoriesSkipped}`,
  );
  console.log(`prices: inserted=${pricesInserted} skipped=${pricesSkipped}`);
  console.log(
    `clients: inserted=${clientsInserted} skipped=${clientsSkipped}`,
  );
  console.log(
    `portfolio: inserted=${portfolioInserted} skipped=${portfolioSkipped}`,
  );
  console.log(`banners: inserted=${bannersInserted} skipped=${bannersSkipped}`);
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
