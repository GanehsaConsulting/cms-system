import { ArticleForm } from "@/components/cms/article-form";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { getCustomCategories } from "@/lib/db/categories";

export default async function NewArticlePage() {
  const customCategories = await getCustomCategories();
  const categories = mergeArticleCategories(customCategories);

  return <ArticleForm categories={categories} />;
}
