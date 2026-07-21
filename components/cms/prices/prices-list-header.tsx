import { CmsPageHeaderActionsSlot } from "@/components/shared/cms-page-header-actions";

interface PricesListHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PricesListHeader({
  title = "Price Management",
  description = "Manage pricing plans for your company profile services.",
  actions,
}: PricesListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </div>
      {actions ?? <CmsPageHeaderActionsSlot />}
    </div>
  );
}
