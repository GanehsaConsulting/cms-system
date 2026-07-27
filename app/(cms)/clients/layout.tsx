import { ClientsWorksSectionLayout } from "@/components/cms/clients/clients-works-section-layout";
import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";

export default function ClientsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CmsPageHeaderActionsProvider>
      <ClientsWorksSectionLayout>{children}</ClientsWorksSectionLayout>
    </CmsPageHeaderActionsProvider>
  );
}
