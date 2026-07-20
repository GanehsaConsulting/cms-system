import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/cms/article-form";
import { getCurrentArticleAuthor } from "@/lib/articles/authors";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getCustomCategories } from "@/lib/db/categories";

export default async function NewArticlePage() {
  const brand = await requireCmsNavHref("/articles");
  const currentAuthor = await getCurrentArticleAuthor();

  if (!currentAuthor) {
    notFound();
  }

  const customCategories = await getCustomCategories(brand.id);
  const categories = mergeArticleCategories(customCategories);

  return (
    <ArticleForm categories={categories} currentAuthor={currentAuthor} />
  );
}
