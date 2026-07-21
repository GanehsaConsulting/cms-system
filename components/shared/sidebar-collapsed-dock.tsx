"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarPresenceCountBadge } from "@/components/cms/sidebar-presence-count-badge";
import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { BrandAppLogo } from "@/components/shared/brand-app-logo";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { useBrand } from "@/components/shared/brand-provider";
import { useNotificationCenter } from "@/components/shared/notification-center-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import {
  SidebarDock,
  SidebarDockItem,
  useSidebarDockTooltipVisible,
} from "@/components/shared/sidebar-dock";
import { SystemAppLogo } from "@/components/shared/system-app-logo";
import { useSidebar } from "@/components/ui/sidebar";
import { isArticleSectionActive } from "@/config/article-tabs";
import { isBannerSectionActive } from "@/config/banner-tabs";
import { isClientSectionActive } from "@/config/client-tabs";
import { type CmsUser, CURRENT_CMS_USER } from "@/config/cms-user";
import {
  appearanceNavItem,
  CMS_NAME,
  notificationsNavItem,
  searchNavItem,
} from "@/config/nav";
import { isPriceSectionActive } from "@/config/price-tabs";
import {
  SIDEBAR_DOCK_ACTIVE_DOT_CLASS,
  SIDEBAR_DOCK_LABEL_CLASS,
  SIDEBAR_DOCK_TRIGGER_CLASS,
} from "@/config/sidebar";
import { SidebarIcon } from "@/lib/icons";
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
  disabled?: boolean;
  children: React.ReactNode;
}

function DockAppButton({
  href,
  label,
  isActive = false,
  onClick,
  disabled = false,
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
          aria-busy={disabled || undefined}
          className={cn(
            SIDEBAR_DOCK_TRIGGER_CLASS,
            disabled && "pointer-events-none opacity-70",
          )}
          onClick={onClick}
          disabled={disabled}
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

  if (href === "/settings") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href;
}

interface SidebarCollapsedDockProps {
  user?: CmsUser;
  onlineCount?: number;
  onOpenProfile?: () => void;
  onOpenPresence?: () => void;
  isProfileOpen?: boolean;
  onOpenSearch?: () => void;
  isSearchOpen?: boolean;
}

export function SidebarCollapsedDock({
  user = CURRENT_CMS_USER,
  onlineCount = 0,
  onOpenProfile,
  onOpenPresence,
  isProfileOpen = false,
  onOpenSearch,
  isSearchOpen = false,
}: SidebarCollapsedDockProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const {
    activeBrand,
    mainNavLinks,
    contentNavLinks,
    utilityNavLinks,
    openSwitcher,
    isSwitchingBrand,
  } = useBrand();
  const { open, openAppearance } = useAppearanceDrawer();
  const { open: notificationsOpen, openNotificationCenter } =
    useNotificationCenter();
  const brandLabel = activeBrand?.name ?? CMS_NAME;

  let index = 0;

  return (
    <SidebarDock>
      {/* Matches expanded: brand + collapse, then Menu → Content → System → profile */}
      <SidebarDockItem index={index++}>
        <DockAppButton
          label={
            isSwitchingBrand ? `Updating ${brandLabel}…` : brandLabel
          }
          onClick={openSwitcher}
          disabled={isSwitchingBrand}
        >
          {activeBrand?.logo ? (
            <BrandAppLogo src={activeBrand.logo} size="dock" />
          ) : (
            <SystemAppLogo size="dock" sidebarShell />
          )}
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton label="Expand sidebar" onClick={toggleSidebar}>
          <SidebarAppIcon icon={SidebarIcon} tone="collapse" size="dock" />
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton
          label={searchNavItem.title}
          isActive={isSearchOpen}
          onClick={onOpenSearch}
        >
          <SidebarAppIcon
            icon={searchNavItem.icon}
            tone={searchNavItem.tone}
            size="dock"
          />
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
        <div className="relative flex items-center justify-center">
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
          {onOpenPresence ? (
            <button
              type="button"
              onClick={onOpenPresence}
              className="absolute -top-0.5 -right-0.5 z-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={`Team presence, ${onlineCount} online`}
            >
              <SidebarPresenceCountBadge count={onlineCount} />
            </button>
          ) : null}
        </div>
      </SidebarDockItem>
    </SidebarDock>
  );
}
