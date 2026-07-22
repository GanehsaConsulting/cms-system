"use client";

import { PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { Button } from "@/components/ui/button";
import { CONTENT_ACTIVITY_ACTION_CONFIRMATIONS } from "@/config/content-activity-form";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteContentActivityAction } from "@/lib/actions/content-activities";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import type { ContentActivity } from "@/types/content-activity";

interface ContentActivityDetailPanelActionsProps {
  item: ContentActivity;
}

export function ContentActivityDetailPanelActions({
  item,
}: ContentActivityDetailPanelActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    requestConfirm({
      ...CONTENT_ACTIVITY_ACTION_CONFIRMATIONS.delete,
      onConfirm: () => {
        startTransition(async () => {
          const notified = await runNotifiedAction(
            () => deleteContentActivityAction(item.id),
            {
              success: "Activity deleted.",
              errorFallback: "Failed to delete activity.",
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
      <div className="flex items-center gap-1.5 border-(--separator) border-t p-3">
        <Button
          variant="secondary"
          size="sm"
          className="gap-1 bg-white/45 dark:bg-secondary"
          nativeButton={false}
          render={<Link href={`/activities/${item.id}/edit`} />}
        >
          <PencilSimpleIcon className="size-3.5" />
          Edit
        </Button>

        <CmsDeleteButton
          type="button"
          className="ml-auto"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          {isPending ? "Deleting..." : "Delete"}
        </CmsDeleteButton>
      </div>

      {confirmDialog}
    </>
  );
}
