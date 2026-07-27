"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { CmsListBulkSelectionBar } from "@/components/shared/cms-list-bulk-selection-bar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PORTFOLIO_WORK_TYPES } from "@/config/clients-works";
import { PORTFOLIO_ACTION_CONFIRMATIONS } from "@/config/portfolio-form";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  deletePortfoliosAction,
  setPortfolioFeaturedAction,
  setPortfolioWorkTypeAction,
} from "@/lib/actions/portfolio";
import { CaretDownIcon, SparkleIcon, TrashIcon } from "@/lib/icons";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import type { PortfolioWorkType } from "@/types/portfolio";

interface PortfolioListBulkBarProps {
  selectedIds: string[];
  onClear: () => void;
}

export function PortfolioListBulkBar({
  selectedIds,
  onClear,
}: PortfolioListBulkBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);
  const count = selectedIds.length;

  function runBulk(
    action: () => Promise<unknown>,
    success: string,
    errorFallback: string,
  ) {
    startTransition(async () => {
      const notified = await runNotifiedAction(action, {
        success,
        errorFallback,
      });
      if (!notified.ok) {
        return;
      }
      onClear();
      router.refresh();
    });
  }

  function handleFeature(featured: boolean) {
    runBulk(
      () => setPortfolioFeaturedAction(selectedIds, featured),
      featured
        ? count === 1
          ? "Work featured."
          : `${count} works featured.`
        : count === 1
          ? "Work unfeatured."
          : `${count} works unfeatured.`,
      "Failed to update works.",
    );
  }

  function handleWorkType(workType: PortfolioWorkType) {
    const label =
      PORTFOLIO_WORK_TYPES.find((item) => item.id === workType)?.label ??
      workType;
    runBulk(
      () => setPortfolioWorkTypeAction(selectedIds, workType),
      count === 1
        ? `Work set to ${label}.`
        : `${count} works set to ${label}.`,
      "Failed to update works.",
    );
  }

  function handleDelete() {
    requestConfirm({
      ...PORTFOLIO_ACTION_CONFIRMATIONS.bulkDelete(count),
      onConfirm: () => {
        runBulk(
          () => deletePortfoliosAction(selectedIds),
          count === 1 ? "Moved to Trash." : `${count} works moved to Trash.`,
          "Failed to delete works.",
        );
      },
    });
  }

  return (
    <>
      <CmsListBulkSelectionBar
        selectedCount={count}
        onClear={onClear}
        disabled={isPending}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          disabled={isPending}
          onClick={() => handleFeature(true)}
        >
          <SparkleIcon className="size-3.5" />
          Feature
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          disabled={isPending}
          onClick={() => handleFeature(false)}
        >
          Unfeature
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isPending}
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                disabled={isPending}
              />
            }
          >
            Set type
            <CaretDownIcon className="size-3.5 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {PORTFOLIO_WORK_TYPES.map((type) => (
              <DropdownMenuItem
                key={type.id}
                onClick={() => handleWorkType(type.id)}
              >
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CmsDeleteButton
          type="button"
          className="h-8"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          Delete
        </CmsDeleteButton>
      </CmsListBulkSelectionBar>

      {confirmDialog}
    </>
  );
}
