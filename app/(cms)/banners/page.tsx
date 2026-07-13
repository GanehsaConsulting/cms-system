import { BannersListView } from "@/components/cms/banners/banners-list-view";
import { getBanners } from "@/lib/db/banners";

export default async function BannersPage() {
  const banners = await getBanners();

  return <BannersListView banners={banners} />;
}
