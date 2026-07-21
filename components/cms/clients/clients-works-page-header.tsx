import { ClientsWorksTabs } from "@/components/cms/clients/clients-works-tabs";
import { CmsPageHeaderActionsSlot } from "@/components/shared/cms-page-header-actions";
import {
  CLIENTS_WORKS_PAGE_DESCRIPTION,
  CLIENTS_WORKS_PAGE_TITLE,
} from "@/config/clients-works";

interface ClientsWorksPageHeaderProps {
  description?: string;
  /** Optional inline actions when not using the shared header actions slot. */
  actions?: React.ReactNode;
}

export function ClientsWorksPageHeader({
  description = CLIENTS_WORKS_PAGE_DESCRIPTION,
  actions,
}: ClientsWorksPageHeaderProps) {
  return (
    <header className="mb-4 w-full shrink-0 space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">
            {CLIENTS_WORKS_PAGE_TITLE}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        </div>
        {actions ?? <CmsPageHeaderActionsSlot />}
      </div>
      <ClientsWorksTabs />
    </header>
  );
}
