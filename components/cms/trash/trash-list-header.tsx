import {
  CmsPageHeaderActionsSlot,
  CmsPageHeaderSubnavSlot,
} from "@/components/shared/cms-page-header-actions";
import { TRASH_COPY } from "@/config/trash";

interface TrashListHeaderProps {
  actions?: React.ReactNode;
}

export function TrashListHeader({ actions }: TrashListHeaderProps) {
  return (
    <header className="mb-4 w-full shrink-0 space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">
            {TRASH_COPY.title}
          </h1>
          <p className="mt-1 max-w-xl text-muted-foreground text-sm leading-relaxed">
            {TRASH_COPY.description}
          </p>
        </div>
        {actions ?? <CmsPageHeaderActionsSlot />}
      </div>
      <CmsPageHeaderSubnavSlot />
    </header>
  );
}
