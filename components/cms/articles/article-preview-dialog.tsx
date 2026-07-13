"use client";

import { ArticlePreviewPage } from "@/components/cms/articles/article-preview-page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92svh,56rem)] w-[min(100vw-1.5rem,56rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none"
      >
        <DialogHeader className="shrink-0 border-[color:var(--separator)] border-b px-5 py-4">
          <DialogTitle>Article Preview</DialogTitle>
          <DialogDescription>
            How this article will appear on your company profile site after
            publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ArticlePreviewPage article={article} publishedAt={publishedAt} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
