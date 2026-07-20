import { ArticleForm } from "@/components/cms/article-form";
import { getArticleAuthorOptions } from "@/lib/articles/authors";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getCustomCategories } from "@/lib/db/categories";
import { getCurrentCmsUser } from "@/lib/users/current";

export default async function NewArticlePage() {
  const brandId = await resolveCmsActiveBrandId();
  const [customCategories, authors, currentUser] = await Promise.all([
    brandId ? getCustomCategories(brandId) : Promise.resolve([]),
    getArticleAuthorOptions(),
    getCurrentCmsUser(),
  ]);
  const categories = mergeArticleCategories(customCategories);
  const defaultAuthorName =
    currentUser?.name ?? authors[0]?.name ?? "CMS Admin";

  return (
    <ArticleForm
      categories={categories}
      authors={authors}
      defaultAuthorName={defaultAuthorName}
    />
  );
}
