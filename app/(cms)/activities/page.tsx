import { Suspense } from "react";
import { ContentActivitiesListHeader } from "@/components/cms/content-activities/content-activities-list-header";
import { ContentActivitiesListView } from "@/components/cms/content-activities/content-activities-list-view";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getContentActivities } from "@/lib/db/content-activities";
import { cn } from "@/lib/utils";

export default function ActivitiesPage() {
  return (
    <CmsSectionLayout header={<ContentActivitiesListHeader />}>
      <Suspense
        fallback={
          <BodyFrame>
            <CmsListBodySkeleton withToolbar={false} />
          </BodyFrame>
        }
      >
        <ActivitiesPageContent />
      </Suspense>
    </CmsSectionLayout>
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

async function ActivitiesPageContent() {
  const brand = await requireCmsNavHref("/activities");
  const items = await getContentActivities(brand.id);

  return (
    <BodyFrame>
      <ContentActivitiesListView items={items} />
    </BodyFrame>
  );
}
