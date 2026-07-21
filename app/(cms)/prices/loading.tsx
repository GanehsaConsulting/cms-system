import { PricesListHeader } from "@/components/cms/prices/prices-list-header";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { CmsHeaderToolbarSkeleton } from "@/components/skeletons/cms-header-toolbar-skeleton";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <CmsSectionLayout
      header={
        <header className="mb-4 shrink-0">
          <PricesListHeader actions={<CmsHeaderToolbarSkeleton />} />
        </header>
      }
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SECTION_BODY_PADDING,
        )}
      >
        <CmsListBodySkeleton withDetailPanel={false} withToolbar={false} />
      </div>
    </CmsSectionLayout>
  );
}
