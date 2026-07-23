"use client";

import { PriceRowActionsMenu } from "@/components/cms/prices/price-row-actions-menu";
import { PriceStatusBadge } from "@/components/cms/prices/price-status-badge";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { getPriceCategoryTitleClass } from "@/config/price-category-styles";
import { getPriceCategoryLabel } from "@/lib/prices/categories";
import {
  calculateDiscountPercent,
  formatPriceCurrency,
} from "@/lib/prices/format";
import { formatPriceDateParts } from "@/lib/prices/list";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import type { Price } from "@/types/price";
import type { PriceCategory } from "@/types/price-category";
import { cn } from "@/lib/utils";

interface PriceListTableRowProps {
  price: Price;
  categories: PriceCategory[];
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function PriceListTableRow({
  price,
  categories,
  isSelected,
  onSelect,
}: PriceListTableRowProps) {
  const updated = formatPriceDateParts(price.updatedAt);
  const discount = calculateDiscountPercent(
    price.price,
    price.strikethroughPrice,
  );
  const categoryId = price.serviceSlug || price.category;
  const knownIds = categories.map((category) => category.id);
  const packageTitle = getPriceDisplayText(price.packageName);
  const serviceName = getPriceCategoryLabel(categoryId, categories);

  return (
    <CmsListTableRow isSelected={isSelected} onClick={() => onSelect(price.id)}>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="min-w-55 leading-tight">
          <p
            className={cn(
              "truncate font-medium",
              getPriceCategoryTitleClass(categoryId, knownIds),
            )}
            title={packageTitle}
          >
            {packageTitle}
          </p>
          <p className="truncate text-muted-foreground text-xs" title={serviceName}>
            {serviceName}
          </p>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="font-medium text-sm tabular-nums">
          {formatPriceCurrency(price.price)}
        </p>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="text-muted-foreground text-sm tabular-nums line-through">
          {formatPriceCurrency(price.strikethroughPrice)}
        </p>
        {discount > 0 ? (
          <p className="text-muted-foreground text-xs">{discount}% off</p>
        ) : null}
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <PriceStatusBadge isActive={price.isActive} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <PriceRowActionsMenu price={price} />
      </TableCell>
    </CmsListTableRow>
  );
}
