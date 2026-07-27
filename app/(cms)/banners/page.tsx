import { Suspense } from "react";
import { BannersListHeader } from "@/components/cms/banners/banners-list-header";
import { BannersListView } from "@/components/cms/banners/banners-list-view";
import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getBanners } from "@/lib/db/banners";
import { getCurrentCmsUser } from "@/lib/users/current";
import { isSuperAdmin } from "@/lib/users/permissions";
import { cn } from "@/lib/utils";

export default function BannersPage() {
  return (
    <CmsPageHeaderActionsProvider>
      <CmsSectionLayout
        header={
          <header className="mb-4 shrink-0">
            <BannersListHeader />
          </header>
        }
      >
        <Suspense
          fallback={
            <BodyFrame>
              <CmsListBodySkeleton
                withDetailPanel={false}
                withToolbar={false}
              />
            </BodyFrame>
          }
        >
          <BannersPageContent />
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

async function BannersPageContent() {
  const brand = await requireCmsNavHref("/banners");
  const [banners, user] = await Promise.all([
    getBanners(brand.id),
    getCurrentCmsUser(),
  ]);

  return (
    <BodyFrame>
      <BannersListView
        banners={banners}
        canDeleteBanner={isSuperAdmin(user)}
      />
    </BodyFrame>
  );
}
