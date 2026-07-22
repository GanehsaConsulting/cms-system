"use client";

import { DesktopIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { PricePreviewDialog } from "@/components/cms/prices/price-preview-dialog";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { Button } from "@/components/ui/button";
import { PRICE_ACTION_CONFIRMATIONS } from "@/config/price-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deletePriceAction } from "@/lib/actions/prices";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import { priceToPreviewData } from "@/lib/prices/preview";
import type { Price } from "@/types/price";

interface PriceDetailPanelActionsProps {
  price: Price;
}

export function PriceDetailPanelActions({ price }: PriceDetailPanelActionsProps) {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  const previewData = useMemo(() => priceToPreviewData(price), [price]);

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
      <div className="flex items-center justify-between gap-1.5 border-(--separator) border-t p-3">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setPreviewOpen(true)}
          >
            <DesktopIcon className="size-3.5" />
            Preview
          </Button>

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
        </div>

        <CmsDeleteButton
          type="button"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          {isPending ? "Deleting..." : "Delete"}
        </CmsDeleteButton>
      </div>

      <PricePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={previewData}
      />

      {confirmDialog}
    </>
  );
}
