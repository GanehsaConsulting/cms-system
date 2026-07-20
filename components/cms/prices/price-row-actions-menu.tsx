"use client";

import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRICE_ACTION_CONFIRMATIONS } from "@/config/price-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deletePriceAction } from "@/lib/actions/prices";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import type { Price } from "@/types/price";

interface PriceRowActionsMenuProps {
  price: Price;
}

export function PriceRowActionsMenu({ price }: PriceRowActionsMenuProps) {
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
          const notified = await runNotifiedAction(
            () => deletePriceAction(price.id),
            {
              success: "Price plan deleted.",
              errorFallback: "Failed to delete price plan.",
            },
          );
          if (!notified.ok) return;
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8"
              aria-label="Price plan actions"
              onClick={(event) => event.stopPropagation()}
            />
          }
        >
          <DotsThreeIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/prices/${price.id}/edit`);
            }}
          >
            <PencilSimpleIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.stopPropagation();
              handleDelete();
            }}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {confirmDialog}
    </>
  );
}
