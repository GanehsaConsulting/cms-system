"use client";

import { PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PriceStatusBadge } from "@/components/cms/prices/price-status-badge";
import { Button } from "@/components/ui/button";
import { PRICE_ACTION_CONFIRMATIONS } from "@/config/price-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deletePriceAction } from "@/lib/actions/prices";
import {
  calculateDiscountPercent,
  formatPriceCurrency,
} from "@/lib/prices/format";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import type { Price } from "@/types/price";

interface PriceDetailPanelActionsProps {
  price: Price;
}

export function PriceDetailPanelActions({ price }: PriceDetailPanelActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    const confirmation = PRICE_ACTION_CONFIRMATIONS.delete(
      getPriceDisplayText(price.packageName),
    );

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        startTransition(async () => {
          await deletePriceAction(price.id);
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <div className="flex items-center gap-1.5 border-[color:var(--separator)] border-t p-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          nativeButton={false}
          render={<Link href={`/prices/${price.id}/edit`} />}
        >
          <PencilSimpleIcon className="size-3.5" />
          Edit
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {confirmDialog}
    </>
  );
}
