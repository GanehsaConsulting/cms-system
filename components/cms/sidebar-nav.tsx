"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarAppearanceButton } from "@/components/cms/sidebar-appearance-button";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { isArticleSectionActive } from "@/config/article-tabs";
import { isPriceSectionActive } from "@/config/price-tabs";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";
import {
  contentNavLinks,
  mainNavLinks,
  utilityNavLinks,
} from "@/config/nav";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function isNavLinkActive(href: string, pathname: string) {
  if (href === "/articles") {
    return isArticleSectionActive(pathname);
  }

  if (href === "/prices") {
    return isPriceSectionActive(pathname);
  }

  return pathname === href;
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup className="p-0">
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {mainNavLinks.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={SEPARATED_MENU_ITEM}
                >
                  <SidebarAppIcon
                    icon={item.icon}
                    gradient={item.gradient}
                    isActive={pathname === item.href}
                  />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="p-0">
        <SidebarGroupLabel>Konten</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {contentNavLinks.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isNavLinkActive(item.href, pathname)}
                  tooltip={item.title}
                  className={SEPARATED_MENU_ITEM}
                >
                  <SidebarAppIcon
                    icon={item.icon}
                    gradient={item.gradient}
                    isActive={isNavLinkActive(item.href, pathname)}
                  />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="p-0">
        <SidebarGroupLabel>Sistem</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarAppearanceButton />
            </SidebarMenuItem>
            {utilityNavLinks.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={SEPARATED_MENU_ITEM}
                >
                  <SidebarAppIcon
                    icon={item.icon}
                    gradient={item.gradient}
                    isActive={pathname === item.href}
                  />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
