import { NextResponse } from "next/server";
import { getTrashedArticles } from "@/lib/db/articles";
import { getTrashedBanners } from "@/lib/db/banners";
import { getTrashedClients } from "@/lib/db/clients";
import { getTrashedContentActivities } from "@/lib/db/content-activities";
import { getTrashedMediaLibraryFiles } from "@/lib/db/media-files";
import { getTrashedMediaFolders } from "@/lib/db/media-folders";
import { getTrashedPortfolioItems } from "@/lib/db/portfolio";
import { getTrashedPrices } from "@/lib/db/prices";
import { getCurrentCmsUser } from "@/lib/users/current";

export async function GET(request: Request) {
  const user = await getCurrentCmsUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const brandId = url.searchParams.get("brandId")?.trim();

  if (!brandId) {
    return NextResponse.json({ count: 0 });
  }

  if (user.role !== "super-admin" && !user.brandAccess.includes(brandId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const mediaInput = {
    brandId,
    ownerUserId: user.id,
  };

  const [
    clients,
    works,
    articles,
    prices,
    activities,
    banners,
    mediaFolders,
    mediaFiles,
  ] = await Promise.all([
    getTrashedClients(brandId),
    getTrashedPortfolioItems(brandId),
    getTrashedArticles(brandId),
    getTrashedPrices(brandId),
    getTrashedContentActivities(brandId),
    getTrashedBanners(brandId),
    getTrashedMediaFolders(mediaInput),
    getTrashedMediaLibraryFiles(mediaInput),
  ]);

  return NextResponse.json({
    count:
      clients.length +
      works.length +
      articles.length +
      prices.length +
      activities.length +
      banners.length +
      mediaFolders.length +
      mediaFiles.length,
  });
}
