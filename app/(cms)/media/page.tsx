import { MediaLibraryView } from "@/components/cms/media/media-library-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getCachedMediaLibraryAssets } from "@/lib/media/cache";
import { getMediaFolders } from "@/lib/db/media-folders";
import { getMediaLibraryFiles } from "@/lib/db/media-files";

export default async function MediaLibraryPage() {
  const brandId = await resolveCmsActiveBrandId();

  console.time("media-library:data");
  const [assets, folders, files] = await Promise.all([
    brandId ? getCachedMediaLibraryAssets(brandId) : Promise.resolve([]),
    getMediaFolders(),
    getMediaLibraryFiles(),
  ]);
  console.timeEnd("media-library:data");

  return (
    <MediaLibraryView assets={assets} folders={folders} files={files} />
  );
}
