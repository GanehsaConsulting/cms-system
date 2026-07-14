import type { Article } from "@/types/article";
import type { Banner } from "@/types/banner";
import type { Client } from "@/types/client";
import type { LocalizedText } from "@/types/locale";
import type { Price } from "@/types/price";

export type DashboardRecentKind = "article" | "client" | "price" | "banner";

export interface DashboardRecentItem {
  id: string;
  kind: DashboardRecentKind;
  title: string;
  subtitle: string;
  href: string;
  updatedAt: string;
}

const KIND_LABEL: Record<DashboardRecentKind, string> = {
  article: "Article",
  client: "Client",
  price: "Price",
  banner: "Banner",
};

function pickLocalized(text: LocalizedText): string {
  return text.en.trim() || text.id.trim() || "Untitled";
}

export function buildDashboardRecentItems(input: {
  articles: Article[];
  clients: Client[];
  prices: Price[];
  banners: Banner[];
  limit: number;
}): DashboardRecentItem[] {
  const articles: DashboardRecentItem[] = input.articles.map((article) => ({
    id: `article:${article.id}`,
    kind: "article",
    title: article.title.trim() || "Untitled",
    subtitle: KIND_LABEL.article,
    href: `/articles/${article.id}/edit`,
    updatedAt: article.updatedAt,
  }));

  const clients: DashboardRecentItem[] = input.clients.map((client) => ({
    id: `client:${client.id}`,
    kind: "client",
    title: client.name.trim() || "Untitled",
    subtitle: KIND_LABEL.client,
    href: `/clients/${client.id}/edit`,
    updatedAt: client.updatedAt,
  }));

  const prices: DashboardRecentItem[] = input.prices.map((price) => ({
    id: `price:${price.id}`,
    kind: "price",
    title: pickLocalized(price.packageName),
    subtitle: KIND_LABEL.price,
    href: `/prices/${price.id}/edit`,
    updatedAt: price.updatedAt,
  }));

  const banners: DashboardRecentItem[] = input.banners.map((banner) => ({
    id: `banner:${banner.id}`,
    kind: "banner",
    title: banner.name.trim() || "Untitled",
    subtitle: KIND_LABEL.banner,
    href: `/banners`,
    updatedAt: banner.updatedAt,
  }));

  return [...articles, ...clients, ...prices, ...banners]
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime(),
    )
    .slice(0, input.limit);
}
