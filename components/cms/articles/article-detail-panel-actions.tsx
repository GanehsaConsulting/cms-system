"use client";

import { useState, useTransition } from "react";
import { DesktopIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticlePreviewDialog } from "@/components/cms/articles/article-preview-dialog";
import { Button } from "@/components/ui/button";
import { ARTICLE_ACTION_CONFIRMATIONS } from "@/config/article-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  deleteArticleAction,
  getArticlePreviewAction,
} from "@/lib/actions/articles";
import { notifyError, runNotifiedAction } from "@/lib/notify/action-toast";
import type { ArticlePreviewData } from "@/types/article-preview";
import type { Article } from "@/types/article";

interface ArticleDetailPanelActionsProps {
  article: Article;
}

export function ArticleDetailPanelActions({
  article,
}: ArticleDetailPanelActionsProps) {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<ArticlePreviewData | null>(null);
  const [previewPublishedAt, setPreviewPublishedAt] = useState(
    article.publishedAt ?? article.updatedAt,
  );
  const [isPending, startTransition] = useTransition();
  const [isPreviewPending, startPreview] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handlePreview() {
    startPreview(async () => {
      const result = await getArticlePreviewAction(article.id);
      if (!result.success) {
        notifyError(result.error);
        return;
      }

      setPreview(result.preview);
      setPreviewPublishedAt(result.publishedAt);
      setPreviewOpen(true);
    });
  }

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
      <div className="flex items-center justify-between gap-1.5 border-(--separator) border-t p-3">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={isPreviewPending}
            onClick={handlePreview}
          >
            <DesktopIcon className="size-3.5" />
            {isPreviewPending ? "Loading..." : "Preview"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            nativeButton={false}
            render={<Link href={`/articles/${article.id}/edit`} />}
          >
            <PencilSimpleIcon className="size-3.5" />
            Edit
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {preview ? (
        <ArticlePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          article={preview}
          publishedAt={previewPublishedAt}
        />
      ) : null}

      {confirmDialog}
    </>
  );
}
