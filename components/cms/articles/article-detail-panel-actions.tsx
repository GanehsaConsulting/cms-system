"use client";

import { useState, useTransition } from "react";
import { DesktopIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticlePreviewDialog } from "@/components/cms/articles/article-preview-dialog";
import { Button } from "@/components/ui/button";
import { ARTICLE_ACTION_CONFIRMATIONS } from "@/config/article-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteArticleAction } from "@/lib/actions/articles";
import type { ArticlePreviewData } from "@/types/article-preview";
import type { Article } from "@/types/article";

interface ArticleDetailPanelActionsProps {
  article: Article;
}

function toPreviewData(article: Article): ArticlePreviewData {
  return {
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    tags: article.tags,
    authorName: article.authorName,
    slug: article.slug,
  };
}

export function ArticleDetailPanelActions({
  article,
}: ArticleDetailPanelActionsProps) {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    const confirmation = ARTICLE_ACTION_CONFIRMATIONS.delete(article.title);

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        startTransition(async () => {
          await deleteArticleAction(article.id);
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <div className="flex items-center gap-1.5 border-[color:var(--separator)] border-t p-3">
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
          render={<Link href={`/articles/${article.id}/edit`} />}
        >
          <PencilSimpleIcon className="size-3.5" />
          Edit
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <ArticlePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        article={toPreviewData(article)}
        publishedAt={article.publishedAt ?? article.updatedAt}
      />

      {confirmDialog}
    </>
  );
}
