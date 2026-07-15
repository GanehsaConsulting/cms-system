import {
  appearanceNavItem,
  contentNavLinks,
  mainNavLinks,
  utilityNavLinks,
  type NavLink,
} from "@/config/nav";
import type { SidebarAppIconTone } from "@/config/sidebar";
import type { Icon } from "@/lib/icons";

export type SidebarSearchAction = "navigate" | "appearance";

export interface SidebarSearchItem {
  id: string;
  title: string;
  keywords: string[];
  icon: Icon;
  tone: SidebarAppIconTone;
  action: SidebarSearchAction;
  href?: string;
}

function toSearchItem(link: NavLink): SidebarSearchItem {
  return {
    id: link.href,
    title: link.title,
    keywords: [link.title, link.href],
    icon: link.icon,
    tone: link.tone,
    action: "navigate",
    href: link.href,
  };
}

export function buildSidebarSearchItems(
  mainLinks: NavLink[] = mainNavLinks,
  contentLinks: NavLink[] = contentNavLinks,
  utilityLinks: NavLink[] = utilityNavLinks,
): SidebarSearchItem[] {
  return [
    ...mainLinks.map(toSearchItem),
    ...contentLinks.map(toSearchItem),
    {
      id: "appearance",
      title: appearanceNavItem.title,
      keywords: [appearanceNavItem.title, "theme", "wallpaper", "accent"],
      icon: appearanceNavItem.icon,
      tone: appearanceNavItem.tone,
      action: "appearance",
    },
    ...utilityLinks.map(toSearchItem),
  ];
}

export const SIDEBAR_SEARCH_ITEMS: SidebarSearchItem[] =
  buildSidebarSearchItems();

export function filterSidebarSearchItems(
  query: string,
  items: SidebarSearchItem[] = SIDEBAR_SEARCH_ITEMS,
): SidebarSearchItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) =>
    item.keywords.some((keyword) =>
      keyword.toLowerCase().includes(normalized),
    ),
  );
}
