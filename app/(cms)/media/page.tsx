import { MediaLibraryView } from "@/components/cms/media/media-library-view";
import { collectMediaLibrary } from "@/lib/media/collect";
import { getArticles } from "@/lib/db/articles";
import { getBanners } from "@/lib/db/banners";
import { getBrands } from "@/lib/db/brands";
import { getClients } from "@/lib/db/clients";
import { getMediaFolders } from "@/lib/db/media-folders";
import { getMediaLibraryFiles } from "@/lib/db/media-files";
import { getPortfolioItems } from "@/lib/db/portfolio";
import { getUsers } from "@/lib/db/users";

export default async function MediaLibraryPage() {
  const [articles, banners, clients, portfolio, brands, users, folders, files] =
    await Promise.all([
      getArticles(),
      getBanners(),
      getClients(),
      getPortfolioItems(),
      getBrands(),
      getUsers(),
      getMediaFolders(),
      getMediaLibraryFiles(),
    ]);

  const assets = collectMediaLibrary({
    articles,
    banners,
    clients,
    portfolio,
    brands,
    users,
  });

  return (
    <MediaLibraryView assets={assets} folders={folders} files={files} />
  );
}
