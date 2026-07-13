import { CmsFormInfoPanel } from "@/components/shared/cms-form-info-panel";
import { formatClientDate } from "@/lib/clients/list";
import type { Client } from "@/types/client";

interface ClientFormInfoPanelProps {
  client?: Client;
  changedSections: string[];
  hasUnsavedChanges: boolean;
}

export function ClientFormInfoPanel({
  client,
  changedSections,
  hasUnsavedChanges,
}: ClientFormInfoPanelProps) {
  return (
    <CmsFormInfoPanel
      createdAt={client?.createdAt}
      updatedAt={client?.updatedAt}
      formatDate={formatClientDate}
      changedSections={changedSections}
      hasUnsavedChanges={hasUnsavedChanges}
      createHint="This client has not been saved yet. Add general details, then save to create it."
      saveReminder="Remember to save so these updates are available across the company profile."
      allSavedHint="No unsaved changes. You are viewing the latest saved version."
      genericDirtyHint="You have edited this client."
    />
  );
}
