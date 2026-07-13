"use client";

import Link from "next/link";
import { CaretLeftIcon, DesktopIcon } from "@/lib/icons";
import { ArticleFormPublishButton } from "@/components/cms/articles/article-form-publish-button";
import { Button } from "@/components/ui/button";
import type { ArticleStatus } from "@/types/article";

interface ArticleFormHeaderProps { 
  mode: "create" | "edit";
  isPending: boolean;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onSetStatus: (status: ArticleStatus) => void;
}

export function ArticleFormHeader({
  mode,
  isPending,
  onPreview,
  onSaveDraft,
  onPublish,
  onSetStatus,
}: ArticleFormHeaderProps) {
  return (
    <div className="space-y-3">
      <Link
        href="/articles"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <CaretLeftIcon className="size-3.5" />
        Back to Article List
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">
            {mode === "create" ? "Create New Article" : "Edit Article"}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Write informative and high-quality articles for your audience.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-1.5"
            disabled={isPending}
            onClick={onPreview}
          >
            <DesktopIcon className="size-3.5" />
            Preview
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="h-9"
            disabled={isPending}
            onClick={onSaveDraft}
          >
            Save Draft
          </Button>

          <ArticleFormPublishButton
            isPending={isPending}
            onPublish={onPublish}
            onSetStatus={onSetStatus}
          />
        </div>
      </div>
    </div>
  );
}
