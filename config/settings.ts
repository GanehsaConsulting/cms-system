export const SETTINGS_TABS = [
  {
    id: "brands",
    label: "Brand Management",
    href: "/settings",
  },
  {
    id: "users",
    label: "User Management",
    href: "/settings/users",
  },
  {
    id: "documentation",
    label: "Documentation",
    href: "/settings/documentation",
  },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export const SETTINGS_PAGE_TITLE = "Settings";

export const SETTINGS_PAGE_DESCRIPTION =
  "Configure brands, enabled modules, user access, and frontend wiring docs.";

export function getSettingsActiveTab(pathname: string): SettingsTabId {
  if (pathname.startsWith("/settings/users")) {
    return "users";
  }

  if (pathname.startsWith("/settings/documentation")) {
    return "documentation";
  }

  return "brands";
}
