import { redirect } from "next/navigation";
import { SettingsPageHeader } from "@/components/cms/settings/settings-page-header";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { getCurrentCmsUser } from "@/lib/users/current";
import { canAccessCmsSettings } from "@/lib/users/permissions";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentCmsUser();

  if (!canAccessCmsSettings(currentUser)) {
    redirect("/");
  }

  return (
    <CmsSectionLayout header={<SettingsPageHeader />}>
      {children}
    </CmsSectionLayout>
  );
}
