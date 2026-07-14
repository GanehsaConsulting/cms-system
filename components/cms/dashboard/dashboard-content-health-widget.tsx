import Link from "next/link";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import type { Icon } from "@/lib/icons";
import {
  DollarSignIcon,
  FolderOpenIcon,
  Person2Icon,
  PhotoIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ContentHealthItem {
  id: string;
  label: string;
  value: number;
  hint: string;
  href: string;
  icon: Icon;
}

interface DashboardContentHealthWidgetProps {
  clientsCount: number;
  pricesCount: number;
  inactivePricesCount: number;
  bannersCount: number;
  inactiveBannersCount: number;
  mediaFilesCount: number;
  className?: string;
}

export function DashboardContentHealthWidget({
  clientsCount,
  pricesCount,
  inactivePricesCount,
  bannersCount,
  inactiveBannersCount,
  mediaFilesCount,
  className,
}: DashboardContentHealthWidgetProps) {
  const items: ContentHealthItem[] = [
    {
      id: "clients",
      label: "Clients",
      value: clientsCount,
      hint: "Profiles",
      href: "/clients",
      icon: Person2Icon,
    },
    {
      id: "prices",
      label: "Prices",
      value: pricesCount,
      hint:
        inactivePricesCount > 0
          ? `${inactivePricesCount} inactive`
          : "Packages",
      href: "/prices",
      icon: DollarSignIcon,
    },
    {
      id: "banners",
      label: "Banners",
      value: bannersCount,
      hint:
        inactiveBannersCount > 0
          ? `${inactiveBannersCount} inactive`
          : "Promos",
      href: "/banners",
      icon: PhotoIcon,
    },
    {
      id: "media",
      label: "Media",
      value: mediaFilesCount,
      hint: "Library files",
      href: "/media",
      icon: FolderOpenIcon,
    },
  ];

  return (
    <DashboardWidget
      variant="glass"
      className={cn("p-2 sm:p-2.5", className)}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-black/4 dark:hover:bg-white/6"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/8">
                <Icon className="size-3.5 text-foreground/65" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-base tabular-nums leading-none">
                  {item.value}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground leading-tight">
                  {item.label}
                  <span className="text-muted-foreground/60"> · {item.hint}</span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
