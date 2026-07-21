import { MediaLibraryPageHeader } from "@/components/cms/media/media-library-page-header";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { CmsHeaderToolbarSkeleton } from "@/components/skeletons/cms-header-toolbar-skeleton";
import { CmsMediaBodySkeleton } from "@/components/skeletons/cms-media-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <CmsSectionLayout
      header={<MediaLibraryPageHeader actions={<CmsHeaderToolbarSkeleton />} />}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SECTION_BODY_PADDING,
        )}
      >
        <CmsMediaBodySkeleton withToolbar={false} />
      </div>
    </CmsSectionLayout>
  );
}
