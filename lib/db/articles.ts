import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Article, ArticleInput } from "@/types/article";
import { normalizeArticle } from "@/lib/articles/list";

const DATA_PATH = path.join(process.cwd(), "data/articles.json");

async function readArticles(): Promise<Article[]> {
  const raw = await readFile(DATA_PATH, "utf-8");
  const articles = JSON.parse(raw) as Article[];
  return articles.map(normalizeArticle);
}

async function writeArticles(articles: Article[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(articles, null, 2)}\n`, "utf-8");
}

export async function getArticles(): Promise<Article[]> {
  const articles = await readArticles();
  return articles.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await readArticles();
  return articles.find((article) => article.id === id) ?? null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await readArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const articles = await readArticles();
  const existing = articles.find((article) => article.slug === input.slug);

  if (existing) {
    throw new Error("Slug is already in use");
  }

  const now = new Date().toISOString();
  const article: Article = {
    id: crypto.randomUUID(),
    ...input,
    publishedAt: input.status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
  };

  articles.push(article);
  await writeArticles(articles);
  return article;
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
): Promise<Article> {
  const articles = await readArticles();
  const index = articles.findIndex((article) => article.id === id);

  if (index === -1) {
    throw new Error("Article not found");
  }

  const slugTaken = articles.some(
    (article) => article.slug === input.slug && article.id !== id,
  );

  if (slugTaken) {
    throw new Error("Slug is already in use");
  }

  const current = articles[index];
  const now = new Date().toISOString();
  const publishedAt =
    input.status === "published"
      ? (current.publishedAt ?? now)
      : input.status === "draft"
        ? null
        : current.publishedAt;

  const updated: Article = {
    ...current,
    ...input,
    publishedAt,
    updatedAt: now,
  };

  articles[index] = updated;
  await writeArticles(articles);
  return updated;
}

export async function deleteArticle(id: string): Promise<void> {
  const articles = await readArticles();
  const nextArticles = articles.filter((article) => article.id !== id);

  if (nextArticles.length === articles.length) {
    throw new Error("Article not found");
  }

  await writeArticles(nextArticles);
}
