import { CmsFormDangerZone } from "@/components/shared/cms-form-danger-zone";

interface PriceFormDangerZoneProps {
  isPending: boolean;
  onDelete: () => void;
}

export function PriceFormDangerZone({
  isPending,
  onDelete,
}: PriceFormDangerZoneProps) {
  return (
    <CmsFormDangerZone
      description="Permanently remove this price plan from the CMS. This cannot be undone."
      deleteLabel="Delete Price Plan"
      isPending={isPending}
      onDelete={onDelete}
    />
  );
}
