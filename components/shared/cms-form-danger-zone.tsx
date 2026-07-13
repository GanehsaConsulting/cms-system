import { TrashIcon } from "@/lib/icons";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Button } from "@/components/ui/button";

interface CmsFormDangerZoneProps {
  description: string;
  deleteLabel: string;
  isPending: boolean;
  onDelete: () => void;
}

export function CmsFormDangerZone({
  description,
  deleteLabel,
  isPending,
  onDelete,
}: CmsFormDangerZoneProps) {
  return (
    <SolidSurface className="space-y-3 border-destructive/40 bg-card p-4">
      <CmsFormSectionHeading
        title="Danger zone"
        description={description}
        accent="danger"
      />
      <Button
        type="button"
        variant="destructive"
        className="w-full gap-1.5 bg-destructive text-white hover:bg-destructive/90"
        disabled={isPending}
        onClick={onDelete}
      >
        <TrashIcon className="size-3.5" />
        {deleteLabel}
      </Button>
    </SolidSurface>
  );
}
