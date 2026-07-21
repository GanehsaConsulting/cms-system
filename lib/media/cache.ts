import { revalidateTag, unstable_cache } from "next/cache";
import { getArticles } from "@/lib/db/articles";
import { getBanners } from "@/lib/db/banners";
import { getBrands } from "@/lib/db/brands";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";
import { getUsers } from "@/lib/db/users";
import { collectMediaLibrary } from "@/lib/media/collect";
import type { MediaAsset } from "@/types/media";

export const MEDIA_LIBRARY_CACHE_TAG = "media-library";

const MEDIA_LIBRARY_REVALIDATE_SECONDS = 60;

async function loadMediaLibraryAssets(brandId: string): Promise<MediaAsset[]> {
  const [articles, banners, clients, portfolio, brands, users] =
    await Promise.all([
      getArticles(brandId),
      getBanners(brandId),
      getClients(brandId),
      getPortfolioItems(brandId),
      getBrands(),
      getUsers(),
    ]);

  return collectMediaLibrary({
    articles,
    banners,
    clients,
    portfolio,
    brands,
    users,
  });
}

/**
 * Cached final media scan (HTML parse + dedupe). DB queries run inside the
 * cache callback; invalidate via {@link revalidateMediaLibraryCache}.
 */
export function getCachedMediaLibraryAssets(
  brandId: string,
): Promise<MediaAsset[]> {
  return unstable_cache(
    async () => loadMediaLibraryAssets(brandId),
    ["media-library-assets", brandId],
    {
      revalidate: MEDIA_LIBRARY_REVALIDATE_SECONDS,
      tags: [MEDIA_LIBRARY_CACHE_TAG],
    },
  )();
}

export function revalidateMediaLibraryCache() {
  // Next.js 16 requires a cacheLife profile; "max" marks the tag stale
  // (stale-while-revalidate on next visit).
  revalidateTag(MEDIA_LIBRARY_CACHE_TAG, "max");
}
