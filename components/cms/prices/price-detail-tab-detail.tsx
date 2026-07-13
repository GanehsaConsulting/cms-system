import { PriceDetailPanelActions } from "@/components/cms/prices/price-detail-panel-actions";
import { PriceStatusBadge } from "@/components/cms/prices/price-status-badge";
import { RADIUS_DEEP } from "@/config/shape";
import {
  calculateDiscountPercent,
  formatPriceCurrency,
} from "@/lib/prices/format";
import { formatPriceDate } from "@/lib/prices/list";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import type { Price } from "@/types/price";
import { cn } from "@/lib/utils";

interface PriceDetailTabDetailProps {
  price: Price;
}

export function PriceDetailTabDetail({ price }: PriceDetailTabDetailProps) {
  const discount = calculateDiscountPercent(
    price.price,
    price.strikethroughPrice,
  );

  return (
    <dl className="mt-4 space-y-4 text-sm">
      <div className="space-y-1">
        <dt className="text-muted-foreground">Service</dt>
        <dd>{getPriceDisplayText(price.service)}</dd>
      </div>

      <div className="space-y-1">
        <dt className="text-muted-foreground">Service slug</dt>
        <dd className="font-mono text-xs">{price.serviceSlug}</dd>
      </div>

      <div className="space-y-1">
        <dt className="text-muted-foreground">Category</dt>
        <dd>{price.category || "—"}</dd>
      </div>

      <div className="space-y-1">
        <dt className="text-muted-foreground">Price</dt>
        <dd className="font-medium tabular-nums">{formatPriceCurrency(price.price)}</dd>
      </div>

      <div className="space-y-1">
        <dt className="text-muted-foreground">Original price</dt>
        <dd className="text-muted-foreground tabular-nums line-through">
          {formatPriceCurrency(price.strikethroughPrice)}
        </dd>
        {discount > 0 ? (
          <dd className="text-muted-foreground text-xs">{discount}% discount</dd>
        ) : null}
      </div>

      <div className="space-y-1">
        <dt className="text-muted-foreground">Status</dt>
        <dd>
          <PriceStatusBadge isActive={price.isActive} />
        </dd>
      </div>

      <div className="space-y-1">
        <dt className="text-muted-foreground">Highlighted</dt>
        <dd>{price.highlighted ? "Yes" : "No"}</dd>
      </div>

      <div className="space-y-1">
        <dt className="text-muted-foreground">Features</dt>
        <dd>{price.features.length}</dd>
      </div>

      {getPriceDisplayText(price.description) ? (
        <div className="space-y-1">
          <dt className="text-muted-foreground">Description</dt>
          <dd className="text-muted-foreground leading-relaxed">
            {getPriceDisplayText(price.description)}
          </dd>
        </div>
      ) : null}

      <div className="space-y-2 border-[color:var(--separator)] border-t pt-4">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Features preview
        </p>
        <ul className="space-y-1.5">
          {price.features.slice(0, 5).map((feature) => (
            <li
              key={feature.id}
              className={cn(
                RADIUS_DEEP,
                "bg-muted/30 px-2.5 py-1.5 text-muted-foreground text-xs",
              )}
            >
              {getPriceDisplayText(feature.name)}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1 border-[color:var(--separator)] border-t pt-4">
        <dt className="text-muted-foreground">Updated</dt>
        <dd>{formatPriceDate(price.updatedAt)}</dd>
      </div>
    </dl>
  );
}
