"use client";

import { ArticlePreviewPage } from "@/components/cms/articles/article-preview-page";
import {
  CmsDialog,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import type { ArticlePreviewData } from "@/types/article-preview";

interface ArticlePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: ArticlePreviewData;
  publishedAt?: string;
}

export function ArticlePreviewDialog({
  open,
  onOpenChange,
  article,
  publishedAt,
}: ArticlePreviewDialogProps) {
  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent
        showCloseButton
        size="full"
        className="flex flex-col"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-(--separator) border-b bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="min-w-0 pr-10">
            <CmsDialogTitle className="truncate text-sm">
              Article preview
            </CmsDialogTitle>
            <CmsDialogDescription className="sr-only">
              Full-screen preview of how this article will appear on the public
              site after publishing.
            </CmsDialogDescription>
            <p className="truncate text-muted-foreground text-xs">
              Browse as on the live article page
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ArticlePreviewPage article={article} publishedAt={publishedAt} />
        </div>
      </CmsDialogContent>
    </CmsDialog>
  );
}
