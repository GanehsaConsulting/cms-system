"use client";

import { useMemo } from "react";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { ARTICLE_READING_WPM } from "@/config/article-form";
import {
  formatReadingTime,
  getArticleFormWordStats,
} from "@/lib/articles/word-count";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormReadingStatsProps {
  values: Pick<
    ArticleFormValues,
    | "title"
    | "excerpt"
    | "content"
    | "metaTitle"
    | "metaDescription"
    | "tags"
  >;
}

interface StatRowProps {
  label: string;
  words: number;
}

function StatRow({ label, words }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">
        {words} {words === 1 ? "word" : "words"}
      </span>
    </div>
  );
}

export function ArticleFormReadingStats({
  values,
}: ArticleFormReadingStatsProps) {
  const stats = useMemo(() => getArticleFormWordStats(values), [values]);

  return (
    <SolidSurface className="space-y-4 p-4 md:p-5">
      <CmsFormSectionHeading
        title="Reading Time"
        description={`Estimated from title, excerpt, and article content at ${ARTICLE_READING_WPM} WPM.`}
        accent="stats"
      />

      <div className="rounded-lg bg-muted/50 px-3 py-3">
        <p className="font-medium text-2xl tracking-tight">
          {formatReadingTime(stats.readingMinutes)}
        </p>
        <p className="mt-1 text-muted-foreground text-xs tabular-nums">
          {stats.readingWords} {stats.readingWords === 1 ? "word" : "words"} to
          read
        </p>
      </div>

      <div className="space-y-2 border-(--separator) border-t pt-4">
        <p className="font-medium text-sm">Word Count</p>
        <div className="space-y-2">
          <StatRow label="Title" words={stats.title} />
          <StatRow label="Excerpt" words={stats.excerpt} />
          <StatRow label="Content" words={stats.content} />
          <StatRow label="Meta title" words={stats.metaTitle} />
          <StatRow label="Meta description" words={stats.metaDescription} />
          <StatRow label="Tags" words={stats.tags} />
        </div>
        <div className="flex items-center justify-between gap-3 border-(--separator) border-t pt-3 font-medium text-sm">
          <span>Total</span>
          <span className="tabular-nums">
            {stats.total} {stats.total === 1 ? "word" : "words"}
          </span>
        </div>
      </div>
    </SolidSurface>
  );
}
