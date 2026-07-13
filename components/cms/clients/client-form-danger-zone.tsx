import { CmsFormDangerZone } from "@/components/shared/cms-form-danger-zone";

interface ClientFormDangerZoneProps {
  isPending: boolean;
  onDelete: () => void;
}

export function ClientFormDangerZone({
  isPending,
  onDelete,
}: ClientFormDangerZoneProps) {
  return (
    <CmsFormDangerZone
      description="Deleting a client also removes its testimonials and gallery photos from the CMS."
      deleteLabel="Delete client"
      isPending={isPending}
      onDelete={onDelete}
    />
  );
}
