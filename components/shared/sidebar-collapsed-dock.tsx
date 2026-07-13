"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { useNotificationCenter } from "@/components/shared/notification-center-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import {
  SidebarDock,
  SidebarDockItem,
  useSidebarDockTooltipVisible,
} from "@/components/shared/sidebar-dock";
import { useSidebar } from "@/components/ui/sidebar";
import { isArticleSectionActive } from "@/config/article-tabs";
import { isBannerSectionActive } from "@/config/banner-tabs";
import { isClientSectionActive } from "@/config/client-tabs";
import { type CmsUser, CURRENT_CMS_USER } from "@/config/cms-user";
import {
  appearanceNavItem,
  CMS_NAME,
  contentNavLinks,
  mainNavLinks,
  notificationsNavItem,
  utilityNavLinks,
} from "@/config/nav";
import { isPriceSectionActive } from "@/config/price-tabs";
import {
  SIDEBAR_DOCK_ACTIVE_DOT_CLASS,
  SIDEBAR_DOCK_LABEL_CLASS,
  SIDEBAR_DOCK_TRIGGER_CLASS,
} from "@/config/sidebar";
import { Building2Icon, SidebarIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

function DockLabel({ label }: { label: string }) {
  const visible = useSidebarDockTooltipVisible();

  return (
    <span
      className={cn(
        SIDEBAR_DOCK_LABEL_CLASS,
        visible ? "opacity-100" : "opacity-0",
      )}
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

  return <span aria-hidden className={SIDEBAR_DOCK_ACTIVE_DOT_CLASS} />;
}

interface DockAppButtonProps {
  href?: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function DockAppButton({
  href,
  label,
  isActive = false,
  onClick,
  children,
}: DockAppButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {href ? (
        <Link
          href={href}
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
        >
          {children}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={label}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
          onClick={onClick}
        >
          {children}
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

  if (href === "/clients") {
    return isClientSectionActive(pathname);
  }

  if (href === "/banners") {
    return isBannerSectionActive(pathname);
  }

  return pathname === href;
}

interface SidebarCollapsedDockProps {
  user?: CmsUser;
  onOpenProfile?: () => void;
  isProfileOpen?: boolean;
}

export function SidebarCollapsedDock({
  user = CURRENT_CMS_USER,
  onOpenProfile,
  isProfileOpen = false,
}: SidebarCollapsedDockProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { open, openAppearance } = useAppearanceDrawer();
  const { open: notificationsOpen, openNotificationCenter } =
    useNotificationCenter();

  let index = 0;

  return (
    <SidebarDock>
      {/* Matches expanded: brand + collapse, then Menu → Content → System → profile */}
      <SidebarDockItem index={index++}>
        <DockAppButton href="/" label={CMS_NAME}>
          <SidebarAppIcon icon={Building2Icon} tone="brand" size="dock" />
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton label="Expand sidebar" onClick={toggleSidebar}>
          <SidebarAppIcon icon={SidebarIcon} tone="collapse" size="dock" />
        </DockAppButton>
      </SidebarDockItem>

      {mainNavLinks.map((item) => {
        const itemIndex = index++;
        const isActive = isDockItemActive(item.href, pathname);

        return (
          <SidebarDockItem key={item.href} index={itemIndex}>
            <DockAppButton
              href={item.href}
              label={item.title}
              isActive={isActive}
            >
              <SidebarAppIcon icon={item.icon} tone={item.tone} size="dock" />
            </DockAppButton>
          </SidebarDockItem>
        );
      })}

      {contentNavLinks.map((item) => {
        const itemIndex = index++;
        const isActive = isDockItemActive(item.href, pathname);

        return (
          <SidebarDockItem key={item.href} index={itemIndex}>
            <DockAppButton
              href={item.href}
              label={item.title}
              isActive={isActive}
            >
              <SidebarAppIcon icon={item.icon} tone={item.tone} size="dock" />
            </DockAppButton>
          </SidebarDockItem>
        );
      })}

      <SidebarDockItem index={index++}>
        <DockAppButton
          label={notificationsNavItem.title}
          isActive={notificationsOpen}
          onClick={openNotificationCenter}
        >
          <SidebarAppIcon
            icon={notificationsNavItem.icon}
            tone={notificationsNavItem.tone}
            size="dock"
          />
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton
          label={appearanceNavItem.title}
          isActive={open}
          onClick={openAppearance}
        >
          <SidebarAppIcon
            icon={appearanceNavItem.icon}
            tone={appearanceNavItem.tone}
            size="dock"
          />
        </DockAppButton>
      </SidebarDockItem>

      {utilityNavLinks.map((item) => {
        const itemIndex = index++;
        const isActive = isDockItemActive(item.href, pathname);

        return (
          <SidebarDockItem key={item.href} index={itemIndex}>
            <DockAppButton
              href={item.href}
              label={item.title}
              isActive={isActive}
            >
              <SidebarAppIcon icon={item.icon} tone={item.tone} size="dock" />
            </DockAppButton>
          </SidebarDockItem>
        );
      })}

      <SidebarDockItem index={index++}>
        <DockAppButton
          label={user.name}
          isActive={isProfileOpen}
          onClick={onOpenProfile}
        >
          <SidebarProfileAvatar
            name={user.name}
            avatarUrl={user.avatarUrl}
            size="dock"
          />
        </DockAppButton>
      </SidebarDockItem>
    </SidebarDock>
  );
}
