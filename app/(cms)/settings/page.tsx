import { BrandListView } from "@/components/cms/settings/brands/brand-list-view";
import { getBrands } from "@/lib/db/brands";

export default async function SettingsPage() {
  const brands = await getBrands();

  return <BrandListView brands={brands} />;
}
