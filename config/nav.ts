import type { SidebarAppIconTone } from "@/config/sidebar";
import {
  BellIcon,
  DollarSignIcon,
  FileTextIcon,
  FolderOpenIcon,
  GearSixIcon,
  type Icon,
  PaintpaletteIcon,
  Person2Icon,
  PhotoIcon,
  SquaresFourIcon,
} from "@/lib/icons";

export interface NavLink {
  title: string;
  href: string;
  icon: Icon;
  tone: SidebarAppIconTone;
}

export interface NavActionItem {
  title: string;
  icon: Icon;
  tone: SidebarAppIconTone;
}

export const CMS_NAME = "CMS System";
export const CMS_TAGLINE = "Company Profile";

export const mainNavLinks: NavLink[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: SquaresFourIcon,
    tone: "overview",
  },
];

export const contentNavLinks: NavLink[] = [
  {
    title: "Articles",
    href: "/articles",
    icon: FileTextIcon,
    tone: "articles",
  },
  {
    title: "Prices Management",
    href: "/prices",
    icon: DollarSignIcon,
    tone: "prices",
  },
  {
    title: "Clients & Works",
    href: "/clients",
    icon: Person2Icon,
    tone: "clients",
  },
  {
    title: "Banners",
    href: "/banners",
    icon: PhotoIcon,
    tone: "banners",
  },
  {
    title: "Media Library",
    href: "/media",
    icon: FolderOpenIcon,
    tone: "media",
  },
];

export const appearanceNavItem: NavActionItem = {
  title: "Appearance",
  icon: PaintpaletteIcon,
  tone: "appearance",
};

export const notificationsNavItem: NavActionItem = {
  title: "Notifications",
  icon: BellIcon,
  tone: "notifications",
};

export const utilityNavLinks: NavLink[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: GearSixIcon,
    tone: "settings",
  },
];
