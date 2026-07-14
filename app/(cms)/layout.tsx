import { CmsShell } from "@/components/cms/cms-shell";
import { RootLayoutBody } from "@/components/shared/root-layout-body";
import { getBrands } from "@/lib/db/brands";

export default async function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brands = await getBrands();

  return (
    <RootLayoutBody>
      <CmsShell brands={brands}>{children}</CmsShell>
    </RootLayoutBody>
  );
}
