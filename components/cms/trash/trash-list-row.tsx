"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { TrashKindBadge } from "@/components/cms/trash/trash-kind-badge";
import { CmsListBulkCheckbox } from "@/components/shared/cms-list-bulk-checkbox";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
  formatTrashDaysLeft,
  formatTrashDeletedAt,
  formatTrashDeletedAtPrecise,
  getTrashDaysLeft,
  getTrashExpiresAt,
  TRASH_ACTION_CONFIRMATIONS,
  TRASH_KIND_LABELS,
} from "@/config/trash";
import {
  LIST_TABLE_BULK_CELL_CLASS,
  LIST_TABLE_CELL_CLASS,
} from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  purgeTrashItemAction,
  restoreTrashItemAction,
} from "@/lib/actions/trash";
import {
  ArrowCounterclockwiseIcon,
  DocumentIcon,
  FolderOpenIcon,
  TrashIcon,
} from "@/lib/icons";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import type { TrashListItem } from "@/types/trash";
import { cn } from "@/lib/utils";

const CELL = cn(LIST_TABLE_CELL_CLASS, "px-3 py-2.5");
const BULK_CELL = cn(LIST_TABLE_BULK_CELL_CLASS, "px-2.5 py-2.5");

interface TrashListRowProps {
  entry: TrashListItem;
  isBulkSelected: boolean;
  onToggleBulk: () => void;
}

export function TrashListRow({
  entry,
  isBulkSelected,
  onToggleBulk,
}: TrashListRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  const kindLabel = TRASH_KIND_LABELS[entry.kind];
  const expiresAt = getTrashExpiresAt(entry.deletedAt);
  const daysLeft = getTrashDaysLeft(entry.deletedAt);
  const secondary = entry.subtitle ?? kindLabel;

  function runAction(
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
      router.refresh();
    });
  }

  function handleRestore() {
    const confirmation =
      entry.kind === "client"
        ? TRASH_ACTION_CONFIRMATIONS.restoreClient(entry.title)
        : TRASH_ACTION_CONFIRMATIONS.restore(entry.title, kindLabel);

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        runAction(
          () => restoreTrashItemAction(entry.kind, entry.id),
          `${kindLabel} restored.`,
          `Failed to restore ${kindLabel.toLowerCase()}.`,
        );
      },
    });
  }

  function handlePurge() {
    const confirmation =
      entry.kind === "client"
        ? TRASH_ACTION_CONFIRMATIONS.purgeClient(entry.title)
        : TRASH_ACTION_CONFIRMATIONS.purge(entry.title, kindLabel);

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        runAction(
          () => purgeTrashItemAction(entry.kind, entry.id),
          `${kindLabel} deleted forever.`,
          `Failed to permanently delete ${kindLabel.toLowerCase()}.`,
        );
      },
    });
  }

  return (
    <>
      <tr className="border-(--separator) border-b last:border-b-0">
        <TableCell className={BULK_CELL}>
          <CmsListBulkCheckbox
            checked={isBulkSelected}
            label={`Select ${entry.title}`}
            onCheckedChange={onToggleBulk}
          />
        </TableCell>
        <TableCell className={CELL}>
          <div className="flex min-w-0 max-w-sm items-center gap-2.5">
            {entry.thumb ? (
              <div
                className={cn(
                  RADIUS_DEEP,
                  "relative size-8 shrink-0 overflow-hidden bg-muted",
                )}
              >
                <Image
                  src={entry.thumb}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  RADIUS_DEEP,
                  "flex size-8 shrink-0 items-center justify-center bg-muted text-muted-foreground",
                )}
              >
                {entry.kind === "media-folder" ? (
                  <FolderOpenIcon className="size-3.5" />
                ) : (
                  <DocumentIcon className="size-3.5" />
                )}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-sm">{entry.title}</p>
              <p className="truncate text-muted-foreground text-xs">
                {secondary}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className={cn(CELL, "w-28")}>
          <TrashKindBadge kind={entry.kind} />
        </TableCell>
        <TableCell className={cn(CELL, "w-40")}>
          <p className="text-muted-foreground text-xs tabular-nums">
            {formatTrashDeletedAtPrecise(entry.deletedAt)}
          </p>
        </TableCell>
        <TableCell className={cn(CELL, "w-36")}>
          <p className="text-muted-foreground text-xs tabular-nums">
            {formatTrashDeletedAt(expiresAt.toISOString())}
          </p>
          <p
            className={cn(
              "text-[11px] tabular-nums",
              daysLeft <= 7
                ? "font-medium text-destructive"
                : "text-muted-foreground/80",
            )}
          >
            {formatTrashDaysLeft(daysLeft)}
          </p>
        </TableCell>
        <TableCell className={cn(CELL, "w-24 text-right")}>
          <div className="flex items-center justify-end gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={isPending}
              aria-label={`Restore ${entry.title}`}
              onClick={handleRestore}
            >
              <ArrowCounterclockwiseIcon className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:text-destructive"
              disabled={isPending}
              aria-label={`Delete ${entry.title} forever`}
              onClick={handlePurge}
            >
              <TrashIcon className="size-3.5" />
            </Button>
          </div>
        </TableCell>
      </tr>
      {confirmDialog}
    </>
  );
}
