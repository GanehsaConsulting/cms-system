import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";

export default function ActivitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CmsPageHeaderActionsProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </CmsPageHeaderActionsProvider>
  );
}
