import { CmsFormDangerZone } from "@/components/shared/cms-form-danger-zone";

interface ArticleFormDangerZoneProps {
  isPending: boolean;
  onDelete: () => void;
}

export function ArticleFormDangerZone({
  isPending,
  onDelete,
}: ArticleFormDangerZoneProps) {
  return (
    <CmsFormDangerZone
      description="Permanently remove this article from the CMS. This cannot be undone."
      deleteLabel="Delete Article"
      isPending={isPending}
      onDelete={onDelete}
    />
  );
}
