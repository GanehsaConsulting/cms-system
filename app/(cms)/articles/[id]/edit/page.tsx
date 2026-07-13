import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/cms/article-form";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { getArticleById } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  const [article, customCategories] = await Promise.all([
    getArticleById(id),
    getCustomCategories(),
  ]);

  if (!article) {
    notFound();
  }

  const categories = mergeArticleCategories(customCategories);

  return <ArticleForm article={article} categories={categories} />;
}
