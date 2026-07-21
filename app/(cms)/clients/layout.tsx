import { ClientsWorksPageHeader } from "@/components/cms/clients/clients-works-page-header";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";

export default function ClientsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CmsSectionLayout header={<ClientsWorksPageHeader />}>
      {children}
    </CmsSectionLayout>
  );
}
