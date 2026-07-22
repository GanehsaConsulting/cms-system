"use client";

import Image from "next/image";
import { XIcon } from "@/lib/icons";
import { ActivityLogPanel } from "@/components/shared/activity-log-panel";
import { PortfolioDetailPanelActions } from "@/components/cms/portfolio/portfolio-detail-panel-actions";
import { PortfolioDetailTabDetail } from "@/components/cms/portfolio/portfolio-detail-tab-detail";
import { PortfolioFeaturedBadge } from "@/components/cms/portfolio/portfolio-featured-badge";
import { Button } from "@/components/ui/button";
import { RADIUS_DEEP } from "@/config/shape";
import type { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioDetailPanelProps {
  item: Portfolio;
  clientName: string;
  onClose: () => void;
}

export function PortfolioDetailPanel({
  item,
  clientName,
  onClose,
}: PortfolioDetailPanelProps) {
  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-(--separator) border-b p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              RADIUS_DEEP,
              "relative flex size-11 shrink-0 items-center justify-center overflow-hidden bg-white/45 dark:bg-white/10",
            )}
          >
            {item.coverImage ? (
              <Image
                src={item.coverImage}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="font-medium text-muted-foreground text-sm">
                {item.title.slice(0, 1).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
              Detail
            </p>
            <h2 className="line-clamp-2 font-semibold text-sm leading-snug">
              {item.title}
            </h2>
            <PortfolioFeaturedBadge featured={item.featured} />
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="size-8 shrink-0 bg-white/45 dark:bg-secondary"
          aria-label="Close panel"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <PortfolioDetailTabDetail item={item} clientName={clientName} />
        <ActivityLogPanel
          entityType="portfolio"
          entityId={item.id}
          className="mt-6"
        />
      </div>

      <PortfolioDetailPanelActions item={item} />
    </aside>
  );
}
