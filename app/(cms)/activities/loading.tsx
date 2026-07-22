import { ContentActivitiesListHeader } from "@/components/cms/content-activities/content-activities-list-header";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { CmsHeaderToolbarSkeleton } from "@/components/skeletons/cms-header-toolbar-skeleton";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

export default function ActivitiesLoading() {
  return (
    <CmsSectionLayout
      header={
        <ContentActivitiesListHeader actions={<CmsHeaderToolbarSkeleton />} />
      }
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SECTION_BODY_PADDING,
        )}
      >
        <CmsListBodySkeleton withToolbar={false} />
      </div>
    </CmsSectionLayout>
  );
}
