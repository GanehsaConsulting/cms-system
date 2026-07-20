import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/cms/article-form";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import {
  type ArticleAuthorOption,
  getArticleAuthorOptions,
} from "@/lib/articles/authors";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { getArticleById } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";
import { getCurrentCmsUser } from "@/lib/users/current";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

function withLegacyAuthor(
  authors: ArticleAuthorOption[],
  authorName: string,
): ArticleAuthorOption[] {
  const trimmed = authorName.trim();
  if (!trimmed) {
    return authors;
  }

  if (
    authors.some(
      (author) => author.name.toLowerCase() === trimmed.toLowerCase(),
    )
  ) {
    return authors;
  }

  return [{ id: `legacy:${trimmed}`, name: trimmed, image: null }, ...authors];
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  const brand = await requireCmsNavHref("/articles");

  const [article, customCategories, authors, currentUser] = await Promise.all([
    getArticleById(brand.id, id),
    getCustomCategories(brand.id),
    getArticleAuthorOptions(),
    getCurrentCmsUser(),
  ]);

  if (!article) {
    notFound();
  }

  const categories = mergeArticleCategories(customCategories);
  const authorOptions = withLegacyAuthor(authors, article.authorName);
  const defaultAuthorName =
    currentUser?.name ?? authorOptions[0]?.name ?? article.authorName;

  return (
    <ArticleForm
      article={article}
      categories={categories}
      authors={authorOptions}
      defaultAuthorName={defaultAuthorName}
    />
  );
}
