import { BannersListView } from "@/components/cms/banners/banners-list-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getBanners } from "@/lib/db/banners";

export default async function BannersPage() {
  const brand = await requireCmsNavHref("/banners");
  const banners = await getBanners(brand.id);

  return <BannersListView banners={banners} />;
}
