import { Suspense } from "react";
import { DashboardView } from "@/components/cms/dashboard/dashboard-view";
import { CmsDashboardBodySkeleton } from "@/components/skeletons/cms-dashboard-body-skeleton";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getArticlesSummary } from "@/lib/db/articles";
import { getBanners } from "@/lib/db/banners";
import { getClients } from "@/lib/db/clients";
import { getContentActivities } from "@/lib/db/content-activities";
import { getMediaLibraryFilesCount } from "@/lib/db/media-files";
import { getPrices } from "@/lib/db/prices";

export default function DashboardPage() {
  return (
    <Suspense fallback={<CmsDashboardBodySkeleton />}>
      <DashboardPageContent />
    </Suspense>
  );
}

async function DashboardPageContent() {
  const brandId = await resolveCmsActiveBrandId();
  const [articles, clients, prices, banners, activities, mediaFilesCount] =
    await Promise.all([
      brandId ? getArticlesSummary(brandId) : Promise.resolve([]),
      brandId ? getClients(brandId) : Promise.resolve([]),
      brandId ? getPrices(brandId) : Promise.resolve([]),
      brandId ? getBanners(brandId) : Promise.resolve([]),
      brandId ? getContentActivities(brandId) : Promise.resolve([]),
      getMediaLibraryFilesCount(),
    ]);

  return (
    <DashboardView
      articles={articles}
      clients={clients}
      prices={prices}
      banners={banners}
      activities={activities}
      mediaFilesCount={mediaFilesCount}
    />
  );
}
