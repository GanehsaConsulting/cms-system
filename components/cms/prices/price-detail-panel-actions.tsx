"use client";

import { PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { PRICE_ACTION_CONFIRMATIONS } from "@/config/price-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deletePriceAction } from "@/lib/actions/prices";
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
      <div className="flex items-center gap-1.5 border-(--separator) border-t p-3">
        <Button
          variant="secondary"
          size="sm"
          className="gap-1 bg-white/45 dark:bg-secondary"
          nativeButton={false}
          render={<Link href={`/prices/${price.id}/edit`} />}
        >
          <PencilSimpleIcon className="size-3.5" />
          Edit
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="ml-auto gap-1 bg-white/45 text-destructive hover:bg-destructive/15 hover:text-destructive dark:bg-secondary"
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
