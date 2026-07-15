"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ARTICLE_ACTION_CONFIRMATIONS } from "@/config/article-actions";
import { CaretDownIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/types/article";

const splitButtonClass =
  "h-9 rounded-none border-0 shadow-none focus-visible:border-transparent focus-visible:ring-0";

type PublishConfirmAction = "publish" | "schedule" | "archive";

interface ArticleFormPublishButtonProps {
  isPending: boolean;
  onPublish: () => void;
  onSetStatus: (status: ArticleStatus) => void;
}

export function ArticleFormPublishButton({
  isPending,
  onPublish,
  onSetStatus,
}: ArticleFormPublishButtonProps) {
  const [confirmAction, setConfirmAction] =
    useState<PublishConfirmAction | null>(null);

  const confirmation =
    confirmAction === "publish"
      ? ARTICLE_ACTION_CONFIRMATIONS.publish
      : confirmAction === "schedule"
        ? ARTICLE_ACTION_CONFIRMATIONS.schedule
        : confirmAction === "archive"
          ? ARTICLE_ACTION_CONFIRMATIONS.archive
          : null;

  function handleConfirm() {
    if (confirmAction === "publish") {
      onPublish();
    } else if (confirmAction === "schedule") {
      onSetStatus("scheduled");
    } else if (confirmAction === "archive") {
      onSetStatus("archived");
    }

    setConfirmAction(null);
  }

  return (
    <>
      <div
        data-slot="button-group"
        className="inline-flex h-9 items-stretch overflow-hidden rounded-lg focus-within:ring-3 focus-within:ring-ring/50"
      >
        <Button
          type="button"
          disabled={isPending}
          className={cn(splitButtonClass, "rounded-l-lg px-3")}
          onClick={() => setConfirmAction("publish")}
        >
          {isPending ? "Saving..." : "Publish"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                disabled={isPending}
                className={cn(
                  splitButtonClass,
                  "rounded-r-lg border-primary-foreground/20 border-l px-2 aria-expanded:bg-primary/80",
                )}
                aria-label="More publish options"
              />
            }
          >
            <CaretDownIcon className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setConfirmAction("publish")}>
              Publish now
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConfirmAction("schedule")}>
              Schedule for later
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSetStatus("draft")}>
              Save as draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConfirmAction("archive")}>
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {confirmation ? (
        <ConfirmDialog
          open
          onOpenChange={(open) => {
            if (!open && !isPending) {
              setConfirmAction(null);
            }
          }}
          title={confirmation.title}
          description={confirmation.description}
          confirmLabel={confirmation.confirmLabel}
          variant={confirmation.variant}
          isPending={isPending}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}
