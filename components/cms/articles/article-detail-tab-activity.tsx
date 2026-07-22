import { ActivityLogPanel } from "@/components/shared/activity-log-panel";

interface ArticleDetailTabActivityProps {
  articleId: string;
}

export function ArticleDetailTabActivity({
  articleId,
}: ArticleDetailTabActivityProps) {
  return (
    <ActivityLogPanel
      entityType="article"
      entityId={articleId}
      className="mt-4"
    />
  );
}
