import { CmsShell } from "@/components/cms/cms-shell";
import { filterBrandsByUserAccess } from "@/lib/brands/access";
import { getBrands } from "@/lib/db/brands";
import { getCurrentCmsUser } from "@/lib/users/current";
import { canAccessCmsSettings } from "@/lib/users/permissions";

export default async function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [brands, currentUser] = await Promise.all([
    getBrands(),
    getCurrentCmsUser(),
  ]);
  const accessibleBrands = filterBrandsByUserAccess(brands, currentUser);

  return (
    <CmsShell
      brands={accessibleBrands}
      canAccessSettings={canAccessCmsSettings(currentUser)}
    >
      {children}
    </CmsShell>
  );
}
