import { ArticleForm } from "@/components/cms/article-form";
import { getArticleAuthorOptions } from "@/lib/articles/authors";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getCustomCategories } from "@/lib/db/categories";
import { getCurrentCmsUser } from "@/lib/users/current";

export default async function NewArticlePage() {
  const brand = await requireCmsNavHref("/articles");
  const [customCategories, authors, currentUser] = await Promise.all([
    getCustomCategories(brand.id),
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
