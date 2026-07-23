import { Suspense } from "react";
import { MediaLibraryPageHeader } from "@/components/cms/media/media-library-page-header";
import { MediaLibraryView } from "@/components/cms/media/media-library-view";
import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";
import { CmsMediaBodySkeleton } from "@/components/skeletons/cms-media-body-skeleton";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getMediaFolders } from "@/lib/db/media-folders";
import { getMediaLibraryFiles } from "@/lib/db/media-files";
import { getCachedMediaLibraryAssets } from "@/lib/media/cache";
import { buildMediaScopeContext } from "@/lib/media/scope";
import { getCurrentCmsUser } from "@/lib/users/current";
import type { MediaFolder, MediaLibraryFile, MediaLibraryScope } from "@/types/media";
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

async function loadScopeLibrary(
  scope: MediaLibraryScope,
  brandId: string | null,
  userId: string | null,
): Promise<{ folders: MediaFolder[]; files: MediaLibraryFile[] }> {
  try {
    const context = buildMediaScopeContext({
      scope,
      brandId,
      ownerUserId: userId,
    });
    const [folders, files] = await Promise.all([
      getMediaFolders(context),
      getMediaLibraryFiles(context),
    ]);
    return { folders, files };
  } catch {
    return { folders: [], files: [] };
  }
}

async function MediaLibraryPageContent() {
  const [brandId, user] = await Promise.all([
    resolveCmsActiveBrandId(),
    getCurrentCmsUser(),
  ]);

  const userId = user?.id ?? null;

  const [assets, shared, brand, personal] = await Promise.all([
    brandId ? getCachedMediaLibraryAssets(brandId) : Promise.resolve([]),
    loadScopeLibrary("shared", brandId, userId),
    loadScopeLibrary("brand", brandId, userId),
    loadScopeLibrary("personal", brandId, userId),
  ]);

  return (
    <BodyFrame>
      <MediaLibraryView
        assets={assets}
        foldersByScope={{
          shared: shared.folders,
          brand: brand.folders,
          personal: personal.folders,
        }}
        filesByScope={{
          shared: shared.files,
          brand: brand.files,
          personal: personal.files,
        }}
      />
    </BodyFrame>
  );
}
