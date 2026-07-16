"use client";

import Link from "next/link";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { useBrand } from "@/components/shared/brand-provider";
import { DASHBOARD_BENTO_MEDIUM_HEIGHT } from "@/config/dashboard";
import { brandSupportsHrefFeature } from "@/lib/dashboard/brand-access";
import {
  DollarSignIcon,
  FolderOpenIcon,
  Person2Icon,
  PhotoIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

interface DashboardShortcut {
  label: string;
  description: string;
  href: string;
  icon: typeof Person2Icon;
}

const SHORTCUTS: DashboardShortcut[] = [
  {
    label: "Clients & works",
    description: "Clients and portfolio",
    href: "/clients",
    icon: Person2Icon,
  },
  {
    label: "Prices",
    description: "Service pricing",
    href: "/prices",
    icon: DollarSignIcon,
  },
  {
    label: "Banners",
    description: "Hero and promos",
    href: "/banners",
    icon: PhotoIcon,
  },
  {
    label: "Files & Media",
    description: "Files and folders",
    href: "/media",
    icon: FolderOpenIcon,
  },
];

interface DashboardShortcutsWidgetProps {
  className?: string;
}

export function DashboardShortcutsWidget({
  className,
}: DashboardShortcutsWidgetProps) {
  const { featureBrand } = useBrand();
  const shortcuts = SHORTCUTS.filter((item) =>
    brandSupportsHrefFeature(featureBrand, item.href, true),
  );

  if (shortcuts.length === 0) {
    return null;
  }

  return (
    <DashboardWidget
      variant="solid"
      className={cn(DASHBOARD_BENTO_MEDIUM_HEIGHT, "p-2.5 sm:p-3", className)}
    >
      <p className="px-1 font-semibold text-sm">Browse</p>
      <div
        className={cn(
          "mt-1.5 grid min-h-0 flex-1 gap-1.5",
          shortcuts.length === 1 ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {shortcuts.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-0 flex-col justify-center gap-1 rounded-xl bg-black/4 px-2.5 py-2 transition-colors hover:bg-black/7 dark:bg-white/6 dark:hover:bg-white/10"
            >
              <Icon className="size-3.5 text-foreground/60" />
              <div className="min-w-0">
                <p className="truncate font-medium text-[11px] leading-tight">
                  {item.label}
                </p>
                <p className="truncate text-[10px] text-muted-foreground leading-tight">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
