"use client";

import { XIcon } from "@/lib/icons";
import { PriceDetailPanelActions } from "@/components/cms/prices/price-detail-panel-actions";
import { PriceDetailTabDetail } from "@/components/cms/prices/price-detail-tab-detail";
import { PriceStatusBadge } from "@/components/cms/prices/price-status-badge";
import { Button } from "@/components/ui/button";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import type { Price } from "@/types/price";

interface PriceDetailPanelProps {
  price: Price;
  onClose: () => void;
}

export function PriceDetailPanel({ price, onClose }: PriceDetailPanelProps) {
  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-[color:var(--separator)] border-b p-4">
        <div className="min-w-0 space-y-2">
          <h2 className="line-clamp-2 font-semibold text-sm leading-snug">
            {getPriceDisplayText(price.packageName)}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <PriceStatusBadge isActive={price.isActive} />
            {price.highlighted ? (
              <span className="text-muted-foreground text-xs">Highlighted</span>
            ) : null}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-8 shrink-0"
          aria-label="Close panel"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <PriceDetailTabDetail price={price} />
      </div>

      <PriceDetailPanelActions price={price} />
    </aside>
  );
}
