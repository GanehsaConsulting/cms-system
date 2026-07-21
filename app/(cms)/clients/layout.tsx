import { ClientsWorksPageHeader } from "@/components/cms/clients/clients-works-page-header";
import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";

export default function ClientsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CmsPageHeaderActionsProvider>
      <CmsSectionLayout header={<ClientsWorksPageHeader />}>
        {children}
      </CmsSectionLayout>
    </CmsPageHeaderActionsProvider>
  );
}
