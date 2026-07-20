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
import { ARTICLE_ACTION_CONFIRMATIONS } from "@/config/article-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteArticleAction } from "@/lib/actions/articles";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import type { Article } from "@/types/article";

interface ArticleRowActionsMenuProps {
  article: Article;
}

export function ArticleRowActionsMenu({ article }: ArticleRowActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    const confirmation = ARTICLE_ACTION_CONFIRMATIONS.delete(article.title);

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        startTransition(async () => {
          const notified = await runNotifiedAction(
            () => deleteArticleAction(article.id),
            {
              success: "Article deleted.",
              errorFallback: "Failed to delete article.",
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
            aria-label="Article actions"
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
            router.push(`/articles/${article.id}/edit`);
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
