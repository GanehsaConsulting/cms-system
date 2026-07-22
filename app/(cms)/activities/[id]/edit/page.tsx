import { notFound } from "next/navigation";
import { ContentActivityForm } from "@/components/cms/content-activity-form";
import { getCurrentArticleAuthor } from "@/lib/articles/authors";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getContentActivityById } from "@/lib/db/content-activities";

interface EditActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditActivityPage({
  params,
}: EditActivityPageProps) {
  const brand = await requireCmsNavHref("/activities");
  const currentAuthor = await getCurrentArticleAuthor();

  if (!currentAuthor) {
    notFound();
  }

  const { id } = await params;
  const item = await getContentActivityById(brand.id, id);

  if (!item) {
    notFound();
  }

  return <ContentActivityForm item={item} currentAuthor={currentAuthor} />;
}
