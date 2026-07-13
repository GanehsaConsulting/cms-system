"use client";

import { ArticlePreviewPage } from "@/components/cms/articles/article-preview-page";
import {
  CmsDialog,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
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
        size="2xl"
        className="flex max-h-[min(92svh,56rem)] flex-col"
      >
        <CmsDialogHeader>
          <CmsDialogTitle>Article Preview</CmsDialogTitle>
          <CmsDialogDescription>
            How this article will appear on your company profile site after
            publishing.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ArticlePreviewPage article={article} publishedAt={publishedAt} />
        </div>
      </CmsDialogContent>
    </CmsDialog>
  );
}
