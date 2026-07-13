import {
  DollarSignIcon,
  FileTextIcon,
  GearSixIcon,
  PaintpaletteIcon,
  SquaresFourIcon,
  type Icon,
} from "@/lib/icons";
import {
  SIDEBAR_APP_ICON_GRADIENTS,
  type SidebarAppIconGradient,
} from "@/config/sidebar";

export interface NavLink {
  title: string;
  href: string;
  icon: Icon;
  gradient: SidebarAppIconGradient;
}

export interface NavActionItem {
  title: string;
  icon: Icon;
  gradient: SidebarAppIconGradient;
}

export const CMS_NAME = "CMS System";
export const CMS_TAGLINE = "Company Profile";

export const mainNavLinks: NavLink[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: SquaresFourIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.overview,
  },
];

export const contentNavLinks: NavLink[] = [
  {
    title: "Artikel",
    href: "/articles",
    icon: FileTextIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.articles,
  },
  {
    title: "Prices",
    href: "/prices",
    icon: DollarSignIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.prices,
  },
];

export const appearanceNavItem: NavActionItem = {
  title: "Appearance",
  icon: PaintpaletteIcon,
  gradient: SIDEBAR_APP_ICON_GRADIENTS.appearance,
};

export const utilityNavLinks: NavLink[] = [
  {
    title: "Pengaturan",
    href: "/settings",
    icon: GearSixIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.settings,
  },
];

/** Flat nav for collapsed dock — excludes home (brand tile covers `/`). */
export const collapsedDockNavItems: NavLink[] = [
  ...contentNavLinks,
  ...utilityNavLinks,
];
