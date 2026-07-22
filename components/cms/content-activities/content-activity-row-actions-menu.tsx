"use client";

import { ArchiveIcon, DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
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
import { CONTENT_ACTIVITY_ACTION_CONFIRMATIONS } from "@/config/content-activity-form";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  deleteContentActivityAction,
  setContentActivityStatusAction,
} from "@/lib/actions/content-activities";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import type { ContentActivity } from "@/types/content-activity";

interface ContentActivityRowActionsMenuProps {
  item: ContentActivity;
}

export function ContentActivityRowActionsMenu({
  item,
}: ContentActivityRowActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleArchive() {
    requestConfirm({
      ...CONTENT_ACTIVITY_ACTION_CONFIRMATIONS.archive,
      onConfirm: () => {
        startTransition(async () => {
          const notified = await runNotifiedAction(
            () => setContentActivityStatusAction(item.id, "archived"),
            {
              success: "Activity archived.",
              errorFallback: "Failed to archive activity.",
            },
          );
          if (!notified.ok) return;
          router.refresh();
        });
      },
    });
  }

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
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8"
              aria-label="Activity actions"
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
              router.push(`/activities/${item.id}/edit`);
            }}
          >
            <PencilSimpleIcon />
            Edit
          </DropdownMenuItem>
          {item.status !== "archived" ? (
            <DropdownMenuItem
              disabled={isPending}
              onClick={(event) => {
                event.stopPropagation();
                handleArchive();
              }}
            >
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
          ) : null}
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
