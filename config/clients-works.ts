import type { PortfolioWorkType } from "@/types/portfolio";

export const CLIENTS_WORKS_TABS = [
  { id: "all", label: "All", href: "/clients" },
  { id: "clients", label: "Clients", href: "/clients/clients" },
  { id: "logos", label: "Logos", href: "/clients/logos" },
  { id: "portfolio", label: "Portfolio", href: "/clients/portfolio" },
] as const;

export type ClientsWorksTabId = (typeof CLIENTS_WORKS_TABS)[number]["id"];

export function getClientsWorksActiveTab(pathname: string): ClientsWorksTabId {
  if (pathname.startsWith("/clients/portfolio")) {
    return "portfolio";
  }

  if (pathname.startsWith("/clients/logos")) {
    return "logos";
  }

  if (
    pathname.startsWith("/clients/clients") ||
    pathname === "/clients/new" ||
    /^\/clients\/[^/]+\/edit$/.test(pathname)
  ) {
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
