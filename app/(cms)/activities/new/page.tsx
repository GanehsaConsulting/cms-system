import { notFound } from "next/navigation";
import { ContentActivityForm } from "@/components/cms/content-activity-form";
import { getCurrentArticleAuthor } from "@/lib/articles/authors";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";

export default async function NewActivityPage() {
  await requireCmsNavHref("/activities");
  const currentAuthor = await getCurrentArticleAuthor();

  if (!currentAuthor) {
    notFound();
  }

  return <ContentActivityForm currentAuthor={currentAuthor} />;
}
