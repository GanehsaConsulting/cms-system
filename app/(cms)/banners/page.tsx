import { BannersListView } from "@/components/cms/banners/banners-list-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getBanners } from "@/lib/db/banners";

export default async function BannersPage() {
  const brandId = await resolveCmsActiveBrandId();
  const banners = brandId ? await getBanners(brandId) : [];

  return <BannersListView banners={banners} />;
}
