import {
  CmsPageHeaderActionsSlot,
  CmsPageHeaderSubnavSlot,
} from "@/components/shared/cms-page-header-actions";

interface ContentActivitiesListHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function ContentActivitiesListHeader({
  title = "Activities",
  description = "Manage activity and promo cards for your public site feed.",
  actions,
}: ContentActivitiesListHeaderProps) {
  return (
    <header className="mb-4 w-full shrink-0 space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        </div>
        {actions ?? <CmsPageHeaderActionsSlot />}
      </div>
      <CmsPageHeaderSubnavSlot />
    </header>
  );
}
