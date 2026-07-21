import { DashboardView } from "@/components/cms/dashboard/dashboard-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getArticlesSummary } from "@/lib/db/articles";
import { getBanners } from "@/lib/db/banners";
import { getClients } from "@/lib/db/clients";
import { getMediaLibraryFiles } from "@/lib/db/media-files";
import { getPrices } from "@/lib/db/prices";

export default async function DashboardPage() {
  const brandId = await resolveCmsActiveBrandId();

  console.time("dashboard:data");
  const [articles, clients, prices, banners, mediaFiles] = await Promise.all([
    brandId ? getArticlesSummary(brandId) : Promise.resolve([]),
    brandId ? getClients(brandId) : Promise.resolve([]),
    brandId ? getPrices(brandId) : Promise.resolve([]),
    brandId ? getBanners(brandId) : Promise.resolve([]),
    getMediaLibraryFiles(),
  ]);
  console.timeEnd("dashboard:data");

  return (
    <DashboardView
      articles={articles}
      clients={clients}
      prices={prices}
      banners={banners}
      mediaFilesCount={mediaFiles.length}
    />
  );
}
