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
import { PORTFOLIO_ACTION_CONFIRMATIONS } from "@/config/portfolio-form";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deletePortfolioAction } from "@/lib/actions/portfolio";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioRowActionsMenuProps {
  item: Portfolio;
}

export function PortfolioRowActionsMenu({
  item,
}: PortfolioRowActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    requestConfirm({
      ...PORTFOLIO_ACTION_CONFIRMATIONS.delete,
      onConfirm: () => {
        startTransition(async () => {
          const notified = await runNotifiedAction(
            () => deletePortfolioAction(item.id),
            {
              success: "Work deleted.",
              errorFallback: "Failed to delete work.",
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
              aria-label="Portfolio actions"
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
              router.push(`/clients/portfolio/${item.id}/edit`);
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
