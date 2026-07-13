import { ArticlesListView } from "@/components/cms/articles/articles-list-view";
import { getArticles } from "@/lib/db/articles";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return <ArticlesListView articles={articles} />;
}
