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
      description="Moving a client to Trash also moves its linked portfolio works. You can restore them later from Trash."
      deleteLabel="Move to Trash"
      isPending={isPending}
      onDelete={onDelete}
    />
  );
}
