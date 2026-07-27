"use client";

import { ClockIcon, TrashIcon, WarningIcon } from "@/lib/icons";
import {
  formatTrashAgeLabel,
  type TrashListStats,
} from "@/config/trash";
import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface TrashListStatsProps {
  stats: TrashListStats;
}

export function TrashListStats({ stats }: TrashListStatsProps) {
  const cards = [
    {
      label: "Total items",
      value: String(stats.total),
      hint: stats.total === 1 ? "item in Trash" : "items in Trash",
      icon: TrashIcon,
      iconClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Expires soon",
      value: String(stats.expiresSoon),
      hint: "within 7 days",
      icon: WarningIcon,
      iconClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    },
    {
      label: "Oldest item",
      value:
        stats.oldestAgeDays === null
          ? "—"
          : formatTrashAgeLabel(stats.oldestAgeDays),
      hint: "time in Trash",
      icon: ClockIcon,
      iconClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
  ] as const;

  return (
    <div className="grid shrink-0 gap-2.5 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              RADIUS_INNER,
              "flex items-center justify-between gap-3 border border-(--separator) bg-card/50 px-3 py-2.5",
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-[0.6rem]",
                  card.iconClass,
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm">{card.label}</p>
                <p className="truncate text-muted-foreground text-xs">
                  {card.hint}
                </p>
              </div>
            </div>
            <p className="shrink-0 font-semibold text-lg tabular-nums tracking-tight">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
