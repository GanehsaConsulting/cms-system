import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/cms/article-form";
import { getCurrentArticleAuthor } from "@/lib/articles/authors";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getArticleById } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  const brand = await requireCmsNavHref("/articles");

  const [article, customCategories, currentAuthor] = await Promise.all([
    getArticleById(brand.id, id),
    getCustomCategories(brand.id),
    getCurrentArticleAuthor(),
  ]);

  if (!article || !currentAuthor) {
    notFound();
  }

  const categories = mergeArticleCategories(customCategories);

  return (
    <ArticleForm
      article={article}
      categories={categories}
      currentAuthor={currentAuthor}
    />
  );
}
