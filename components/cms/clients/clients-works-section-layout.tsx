"use client";

import { usePathname } from "next/navigation";
import { ClientsWorksPageHeader } from "@/components/cms/clients/clients-works-page-header";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { isClientsWorksListPath } from "@/config/clients-works";

interface ClientsWorksSectionLayoutProps {
  children: React.ReactNode;
}

/**
 * Section chrome (title + tabs) only on list tabs.
 * Pass `header={null}` on form routes so CmsSectionLayout does not keep an empty
 * `p-3` / `pt-3` wrapper — React elements are always truthy even when they render null.
 */
export function ClientsWorksSectionLayout({
  children,
}: ClientsWorksSectionLayoutProps) {
  const pathname = usePathname();
  const showListChrome = isClientsWorksListPath(pathname);

  return (
    <CmsSectionLayout
      header={showListChrome ? <ClientsWorksPageHeader /> : null}
    >
      {children}
    </CmsSectionLayout>
  );
}
