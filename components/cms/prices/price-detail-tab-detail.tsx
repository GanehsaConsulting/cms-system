import { PriceStatusBadge } from "@/components/cms/prices/price-status-badge";
import { CmsDetailMetaGroup } from "@/components/shared/cms-detail-meta-group";
import { CmsDetailMetaRow } from "@/components/shared/cms-detail-meta-row";
import { RADIUS_DEEP } from "@/config/shape";
import {
  calculateDiscountPercent,
  formatPriceCurrency,
} from "@/lib/prices/format";
import { getPriceCategoryLabel } from "@/lib/prices/categories";
import { formatPriceDate } from "@/lib/prices/list";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import type { Price } from "@/types/price";
import type { PriceCategory } from "@/types/price-category";
import { cn } from "@/lib/utils";

interface PriceDetailTabDetailProps {
  price: Price;
  categories: PriceCategory[];
}

export function PriceDetailTabDetail({
  price,
  categories,
}: PriceDetailTabDetailProps) {
  const discount = calculateDiscountPercent(
    price.price,
    price.strikethroughPrice,
  );
  const description = getPriceDisplayText(price.description);
  const whatsappMessage = getPriceDisplayText(price.whatsappMessage);

  return (
    <div className="space-y-4">
      <CmsDetailMetaGroup label="Overview">
        <CmsDetailMetaRow label="Category">
          {getPriceCategoryLabel(price.serviceSlug, categories)}
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Status">
          <span className="inline-flex justify-end">
            <PriceStatusBadge isActive={price.isActive} />
          </span>
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Highlighted" showDivider={false}>
          {price.highlighted ? "Yes" : "No"}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>

      <CmsDetailMetaGroup label="Pricing">
        <CmsDetailMetaRow label="Display">
          <span className="tabular-nums">
            {formatPriceCurrency(price.price)}
          </span>
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Gimmick">
          <span className="text-muted-foreground tabular-nums line-through">
            {formatPriceCurrency(price.strikethroughPrice)}
          </span>
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Discount" showDivider={false}>
          {discount > 0 ? (
            <span className="text-chart-3">{discount}% off</span>
          ) : (
            "—"
          )}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>

      <CmsDetailMetaGroup label="WhatsApp">
        <CmsDetailMetaRow label="Phone">
          <span className="font-mono text-xs">
            {price.whatsappPhone || "—"}
          </span>
        </CmsDetailMetaRow>
        <CmsDetailMetaRow
          label="Message"
          stacked
          showDivider={false}
        >
          <span className="text-muted-foreground">
            {whatsappMessage || "—"}
          </span>
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>

      <CmsDetailMetaGroup label="Features">
        <CmsDetailMetaRow label="Count">
          {price.features.length}
        </CmsDetailMetaRow>
        {price.features.length > 0 ? (
          <CmsDetailMetaRow label="Preview" stacked showDivider={false}>
            <ul className="space-y-1.5">
              {price.features.slice(0, 5).map((feature) => (
                <li
                  key={feature.id}
                  className={cn(
                    RADIUS_DEEP,
                    "bg-white/45 px-2.5 py-1.5 text-muted-foreground text-xs dark:bg-white/8",
                  )}
                >
                  {getPriceDisplayText(feature.name)}
                </li>
              ))}
            </ul>
          </CmsDetailMetaRow>
        ) : (
          <CmsDetailMetaRow label="Preview" showDivider={false}>
            —
          </CmsDetailMetaRow>
        )}
      </CmsDetailMetaGroup>

      {description ? (
        <CmsDetailMetaGroup label="Description">
          <CmsDetailMetaRow label="Copy" stacked showDivider={false}>
            <span className="text-muted-foreground">{description}</span>
          </CmsDetailMetaRow>
        </CmsDetailMetaGroup>
      ) : null}

      <CmsDetailMetaGroup>
        <CmsDetailMetaRow label="Updated" showDivider={false}>
          {formatPriceDate(price.updatedAt)}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>
    </div>
  );
}
