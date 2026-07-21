import { Suspense } from "react";
import { MediaLibraryPageHeader } from "@/components/cms/media/media-library-page-header";
import { MediaLibraryView } from "@/components/cms/media/media-library-view";
import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";
import { CmsMediaBodySkeleton } from "@/components/skeletons/cms-media-body-skeleton";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getCachedMediaLibraryAssets } from "@/lib/media/cache";
import { getMediaFolders } from "@/lib/db/media-folders";
import { getMediaLibraryFiles } from "@/lib/db/media-files";
import { cn } from "@/lib/utils";

export default function MediaLibraryPage() {
  return (
    <CmsPageHeaderActionsProvider>
      <CmsSectionLayout header={<MediaLibraryPageHeader />}>
        <Suspense
          fallback={
            <BodyFrame>
              <CmsMediaBodySkeleton />
            </BodyFrame>
          }
        >
          <MediaLibraryPageContent />
        </Suspense>
      </CmsSectionLayout>
    </CmsPageHeaderActionsProvider>
  );
}

function BodyFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      {children}
    </div>
  );
}

async function MediaLibraryPageContent() {
  const brandId = await resolveCmsActiveBrandId();
  const [assets, folders, files] = await Promise.all([
    brandId ? getCachedMediaLibraryAssets(brandId) : Promise.resolve([]),
    getMediaFolders(),
    getMediaLibraryFiles(),
  ]);

  return (
    <BodyFrame>
      <MediaLibraryView assets={assets} folders={folders} files={files} />
    </BodyFrame>
  );
}
