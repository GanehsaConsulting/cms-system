import { ArticlesListView } from "@/components/cms/articles/articles-list-view";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { getArticles } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";

export default async function ArticlesPage() {
  const [articles, customCategories] = await Promise.all([
    getArticles(),
    getCustomCategories(),
  ]);
  const categories = mergeArticleCategories(customCategories);

  return <ArticlesListView articles={articles} categories={categories} />;
}
