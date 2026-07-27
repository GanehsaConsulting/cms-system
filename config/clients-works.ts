import type { PortfolioWorkType } from "@/types/portfolio";

export const CLIENTS_WORKS_TABS = [
  { id: "all", label: "All", href: "/clients" },
  { id: "clients", label: "Client Photos", href: "/clients/clients" },
  { id: "logos", label: "Logos", href: "/clients/logos" },
  { id: "portfolio", label: "Portfolio", href: "/clients/portfolio" },
] as const;

export type ClientsWorksTabId = (typeof CLIENTS_WORKS_TABS)[number]["id"];

/** List tabs only — hide Clients & Works chrome on new/edit/detail form pages. */
export function isClientsWorksListPath(pathname: string): boolean {
  return CLIENTS_WORKS_TABS.some((tab) => tab.href === pathname);
}

export function getClientsWorksActiveTab(pathname: string): ClientsWorksTabId {
  if (pathname.startsWith("/clients/portfolio")) {
    return "portfolio";
  }

  if (pathname.startsWith("/clients/logos")) {
    return "logos";
  }

  if (pathname.startsWith("/clients/clients")) {
    return "clients";
  }

  return "all";
}

export const CLIENTS_WORKS_PAGE_TITLE = "Clients & Works";

export const CLIENTS_WORKS_PAGE_DESCRIPTION =
  "Manage client profiles and the social media & website works tied to them.";

export const PORTFOLIO_WORK_TYPES: {
  id: PortfolioWorkType;
  label: string;
}[] = [
  { id: "social-media", label: "Social media" },
  { id: "website", label: "Website" },
];

export const PORTFOLIO_WORK_TYPE_LABELS: Record<PortfolioWorkType, string> = {
  "social-media": "Social media",
  website: "Website",
};

export function isPortfolioWorkType(value: string): value is PortfolioWorkType {
  return value === "social-media" || value === "website";
}
