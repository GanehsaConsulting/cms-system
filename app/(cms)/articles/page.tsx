import { ArticlesListView } from "@/components/cms/articles/articles-list-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { getArticles } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";

export default async function ArticlesPage() {
  const brand = await requireCmsNavHref("/articles");
  const [articles, customCategories] = await Promise.all([
    getArticles(brand.id),
    getCustomCategories(brand.id),
  ]);
  const categories = mergeArticleCategories(customCategories);

  return <ArticlesListView articles={articles} categories={categories} />;
}
