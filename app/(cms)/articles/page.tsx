import { ArticlesListView } from "@/components/cms/articles/articles-list-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { getArticles } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";

export default async function ArticlesPage() {
  const brandId = await resolveCmsActiveBrandId();
  const [articles, customCategories] = await Promise.all([
    brandId ? getArticles(brandId) : Promise.resolve([]),
    brandId ? getCustomCategories(brandId) : Promise.resolve([]),
  ]);
  const categories = mergeArticleCategories(customCategories);

  return <ArticlesListView articles={articles} categories={categories} />;
}
