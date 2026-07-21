import { CmsPageHeaderActionsSlot } from "@/components/shared/cms-page-header-actions";
import {
  MEDIA_LIBRARY_PAGE_DESCRIPTION,
  MEDIA_LIBRARY_PAGE_TITLE,
} from "@/config/media-library";

interface MediaLibraryPageHeaderProps {
  actions?: React.ReactNode;
}

export function MediaLibraryPageHeader({ actions }: MediaLibraryPageHeaderProps) {
  return (
    <header className="mb-4 w-full shrink-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">
            {MEDIA_LIBRARY_PAGE_TITLE}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {MEDIA_LIBRARY_PAGE_DESCRIPTION}
          </p>
        </div>
        {actions ?? <CmsPageHeaderActionsSlot />}
      </div>
    </header>
  );
}
