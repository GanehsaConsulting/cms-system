import { DashboardView } from "@/components/cms/dashboard/dashboard-view";
import { getArticles } from "@/lib/db/articles";
import { getBanners } from "@/lib/db/banners";
import { getClients } from "@/lib/db/clients";
import { getMediaLibraryFiles } from "@/lib/db/media-files";
import { getPrices } from "@/lib/db/prices";

export default async function DashboardPage() {
  const [articles, clients, prices, banners, mediaFiles] = await Promise.all([
    getArticles(),
    getClients(),
    getPrices(),
    getBanners(),
    getMediaLibraryFiles(),
  ]);

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
