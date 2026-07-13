import { CmsFormInfoPanel } from "@/components/shared/cms-form-info-panel";
import { formatPriceDate } from "@/lib/prices/list";
import type { Price } from "@/types/price";

interface PriceFormInfoPanelProps {
  price?: Price;
  changedSections: string[];
  hasUnsavedChanges: boolean;
}

export function PriceFormInfoPanel({
  price,
  changedSections,
  hasUnsavedChanges,
}: PriceFormInfoPanelProps) {
  return (
    <CmsFormInfoPanel
      createdAt={price?.createdAt}
      updatedAt={price?.updatedAt}
      formatDate={formatPriceDate}
      changedSections={changedSections}
      hasUnsavedChanges={hasUnsavedChanges}
      createHint="This plan has not been saved yet. Fill in the required fields, then save to create it."
      saveReminder="Remember to save so these updates appear on the public pricing page."
      allSavedHint="No unsaved changes. You are viewing the latest saved version."
      genericDirtyHint="You have edited this plan."
    />
  );
}
