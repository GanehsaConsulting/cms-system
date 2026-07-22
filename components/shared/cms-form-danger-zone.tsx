import { TrashIcon } from "@/lib/icons";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { SolidSurface } from "@/components/shared/solid-surface";

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
    <SolidSurface className="space-y-3 border-destructive/40 bg-card p-4 md:p-5">
      <CmsFormSectionHeading
        title="Danger zone"
        description={description}
        accent="danger"
      />
      <CmsDeleteButton
        type="button"
        className="w-full gap-1.5"
        disabled={isPending}
        onClick={onDelete}
      >
        <TrashIcon className="size-3.5" />
        {deleteLabel}
      </CmsDeleteButton>
    </SolidSurface>
  );
}
