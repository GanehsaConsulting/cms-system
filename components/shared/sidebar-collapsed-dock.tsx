"use client";

import { Building2Icon, SidebarIcon } from "@/lib/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import {
  SidebarDock,
  SidebarDockItem,
  useSidebarDockTooltipVisible,
} from "@/components/shared/sidebar-dock";
import { useSidebar } from "@/components/ui/sidebar";
import {
  CMS_NAME,
  appearanceNavItem,
  collapsedDockNavItems,
} from "@/config/nav";
import { isArticleSectionActive } from "@/config/article-tabs";
import { isPriceSectionActive } from "@/config/price-tabs";
import {
  SIDEBAR_APP_ICON_GLYPH,
  SIDEBAR_APP_ICON_GRADIENTS,
  SIDEBAR_APP_ICON_SHELL,
  SIDEBAR_DOCK_ACTIVE_DOT_CLASS,
  SIDEBAR_DOCK_LABEL_CLASS,
  SIDEBAR_DOCK_TRIGGER_CLASS,
} from "@/config/sidebar";
import { cn } from "@/lib/utils";

function DockLabel({ label }: { label: string }) {
  const visible = useSidebarDockTooltipVisible();

  return (
    <span
      className={cn(SIDEBAR_DOCK_LABEL_CLASS, visible ? "opacity-100" : "opacity-0")}
      aria-hidden={!visible}
    >
      {label}
    </span>
  );
}

function DockActiveDot({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }

  return (
    <span
      aria-hidden
      className={SIDEBAR_DOCK_ACTIVE_DOT_CLASS}
    />
  );
}

interface DockAppButtonProps {
  href?: string;
  label: string;
  gradient?: string;
  isActive?: boolean;
  onClick?: () => void;
  bare?: boolean;
  children: React.ReactNode;
}

function DockAppButton({
  href,
  label,
  gradient,
  isActive = false,
  onClick,
  bare = false,
  children,
}: DockAppButtonProps) {
  const icon = bare ? (
    children
  ) : (
    <span className={cn(SIDEBAR_APP_ICON_SHELL, "bg-linear-to-b", gradient)}>
      {children}
    </span>
  );

  return (
    <div className="relative flex items-center justify-center">
      {href ? (
        <Link
          href={href}
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
        >
          {icon}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={label}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
          onClick={onClick}
        >
          {icon}
        </button>
      )}
      <DockLabel label={label} />
      <DockActiveDot active={isActive} />
    </div>
  );
}

function isDockItemActive(href: string, pathname: string) {
  if (href === "/articles") {
    return isArticleSectionActive(pathname);
  }

  if (href === "/prices") {
    return isPriceSectionActive(pathname);
  }

  return pathname === href;
}

export function SidebarCollapsedDock() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { open, openAppearance } = useAppearanceDrawer();

  let index = 0;

  return (
    <SidebarDock>
      <SidebarDockItem index={index++}>
        <DockAppButton href="/" label={CMS_NAME} bare>
          <SidebarAppIcon
            icon={Building2Icon}
            gradient={SIDEBAR_APP_ICON_GRADIENTS.brand}
            forceAppStyle
          />
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton
          label="Perluas sidebar"
          gradient={SIDEBAR_APP_ICON_GRADIENTS.collapse}
          onClick={toggleSidebar}
        >
          <SidebarIcon className={SIDEBAR_APP_ICON_GLYPH} />
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton
          label={appearanceNavItem.title}
          gradient={appearanceNavItem.gradient}
          isActive={open}
          onClick={openAppearance}
        >
          <appearanceNavItem.icon className={SIDEBAR_APP_ICON_GLYPH} />
        </DockAppButton>
      </SidebarDockItem>

      {collapsedDockNavItems.map((item) => {
        const itemIndex = index++;
        const isActive = isDockItemActive(item.href, pathname);

        return (
          <SidebarDockItem key={item.href} index={itemIndex}>
            <DockAppButton
              href={item.href}
              label={item.title}
              gradient={item.gradient}
              isActive={isActive}
            >
              <item.icon className={SIDEBAR_APP_ICON_GLYPH} />
            </DockAppButton>
          </SidebarDockItem>
        );
      })}
    </SidebarDock>
  );
}
