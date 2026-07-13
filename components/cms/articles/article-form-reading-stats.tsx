"use client";

import { useMemo } from "react";
import { GlassSurface } from "@/components/shared/glass-surface";
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
    <GlassSurface className="p-4">
      <h2 className="font-semibold text-sm">Reading Time</h2>
      <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
        Estimated from title, excerpt, and article content at{" "}
        {ARTICLE_READING_WPM} WPM.
      </p>

      <div className="mt-4 rounded-lg border border-input bg-muted/15 px-3 py-3">
        <p className="font-medium text-2xl tracking-tight">
          {formatReadingTime(stats.readingMinutes)}
        </p>
        <p className="mt-1 text-muted-foreground text-xs tabular-nums">
          {stats.readingWords} {stats.readingWords === 1 ? "word" : "words"} to
          read
        </p>
      </div>

      <div className="mt-4 space-y-2 border-[color:var(--separator)] border-t pt-4">
        <p className="font-medium text-sm">Word Count</p>
        <div className="space-y-2">
          <StatRow label="Title" words={stats.title} />
          <StatRow label="Excerpt" words={stats.excerpt} />
          <StatRow label="Content" words={stats.content} />
          <StatRow label="Meta title" words={stats.metaTitle} />
          <StatRow label="Meta description" words={stats.metaDescription} />
          <StatRow label="Tags" words={stats.tags} />
        </div>
        <div className="flex items-center justify-between gap-3 border-[color:var(--separator)] border-t pt-3 font-medium text-sm">
          <span>Total</span>
          <span className="tabular-nums">
            {stats.total} {stats.total === 1 ? "word" : "words"}
          </span>
        </div>
      </div>
    </GlassSurface>
  );
}
