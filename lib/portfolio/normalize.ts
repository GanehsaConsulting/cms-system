import type { Portfolio } from "@/types/portfolio";
import { isPortfolioWorkType } from "@/config/clients-works";

export function normalizePortfolio(raw: Portfolio): Portfolio {
  return {
    id: String(raw.id ?? ""),
    brandId: String(raw.brandId ?? "").trim(),
    title: String(raw.title ?? "").trim(),
    clientId: String(raw.clientId ?? "").trim(),
    workType: isPortfolioWorkType(String(raw.workType ?? ""))
      ? raw.workType
      : "website",
    coverImage: String(raw.coverImage ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    url: String(raw.url ?? "").trim(),
    featured: Boolean(raw.featured),
    clickCount: Number.isFinite(raw.clickCount)
      ? Math.max(0, Math.floor(raw.clickCount))
      : 0,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
    deletedAt: raw.deletedAt ?? null,
  };
}
