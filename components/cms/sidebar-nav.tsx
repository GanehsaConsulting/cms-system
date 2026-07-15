"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarAppearanceButton } from "@/components/cms/sidebar-appearance-button";
import { SidebarNavGroup } from "@/components/cms/sidebar-nav-group";
import { SidebarNotificationsButton } from "@/components/cms/sidebar-notifications-button";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { isArticleSectionActive } from "@/config/article-tabs";
import { isBannerSectionActive } from "@/config/banner-tabs";
import { isClientSectionActive } from "@/config/client-tabs";
import { useBrand } from "@/components/shared/brand-provider";
import { isPriceSectionActive } from "@/config/price-tabs";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";

function isNavLinkActive(href: string, pathname: string) {
  if (href === "/articles") {
    return isArticleSectionActive(pathname);
  }

  if (href === "/prices") {
    return isPriceSectionActive(pathname);
  }

  if (href === "/clients") {
    return isClientSectionActive(pathname);
  }

  if (href === "/banners") {
    return isBannerSectionActive(pathname);
  }

  if (href === "/settings") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href;
}

export function SidebarNav() {
  const pathname = usePathname();
  const { mainNavLinks, contentNavLinks, utilityNavLinks } = useBrand();

  return (
    <div className="flex flex-col gap-2">
      {mainNavLinks.length > 0 ? (
        <SidebarNavGroup id="menu" label="Menu">
          <SidebarMenu className="gap-1">
            {mainNavLinks.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={SEPARATED_MENU_ITEM}
                >
                  <SidebarAppIcon icon={item.icon} tone={item.tone} />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarNavGroup>
      ) : null}

      {contentNavLinks.length > 0 ? (
        <SidebarNavGroup id="content" label="Content">
          <SidebarMenu className="gap-1">
            {contentNavLinks.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isNavLinkActive(item.href, pathname)}
                  tooltip={item.title}
                  className={SEPARATED_MENU_ITEM}
                >
                  <SidebarAppIcon icon={item.icon} tone={item.tone} />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarNavGroup>
      ) : null}

      <SidebarNavGroup id="system" label="System">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarNotificationsButton />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarAppearanceButton />
          </SidebarMenuItem>
          {utilityNavLinks.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                render={<Link href={item.href} />}
                isActive={isNavLinkActive(item.href, pathname)}
                tooltip={item.title}
                className={SEPARATED_MENU_ITEM}
              >
                <SidebarAppIcon icon={item.icon} tone={item.tone} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarNavGroup>
    </div>
  );
}
