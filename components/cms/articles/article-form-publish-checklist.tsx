"use client";

import { useMemo } from "react";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CheckIcon } from "@/lib/icons";
import { getArticlePublishChecklist } from "@/lib/articles/publish-checklist";
import type { PublishChecklistValues } from "@/lib/articles/publish-checklist";
import { cn } from "@/lib/utils";

interface ArticleFormPublishChecklistProps {
  values: PublishChecklistValues;
}

function getScoreTone(score: number): string {
  if (score >= 80) {
    return "text-emerald-600 dark:text-emerald-400";
  }

  if (score >= 50) {
    return "text-amber-600 dark:text-amber-400";
  }

  return "text-destructive";
}

function getProgressTone(score: number): string {
  if (score >= 80) {
    return "bg-emerald-500";
  }

  if (score >= 50) {
    return "bg-amber-500";
  }

  return "bg-destructive";
}

interface ChecklistRowProps {
  label: string;
  hint: string;
  completed: boolean;
  required: boolean;
}

function ChecklistRow({ label, hint, completed, required }: ChecklistRowProps) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
          completed
            ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500"
            : "border-muted-foreground/35 bg-background",
        )}
      >
        {completed ? <CheckIcon className="size-2.5" /> : null}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm leading-none",
            completed ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
          {required ? (
            <span className="ml-1 text-destructive text-xs">*</span>
          ) : null}
        </p>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          {hint}
        </p>
      </div>
    </li>
  );
}

export function ArticleFormPublishChecklist({
  values,
}: ArticleFormPublishChecklistProps) {
  const checklist = useMemo(
    () => getArticlePublishChecklist(values),
    [values],
  );

  return (
    <GlassSurface className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-sm">Publish Checklist</h2>
          <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
            {checklist.completedCount} of {checklist.totalCount} complete
          </p>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "font-semibold text-2xl tabular-nums tracking-tight",
              getScoreTone(checklist.score),
            )}
          >
            {checklist.score}
          </p>
          <p className="text-muted-foreground text-xs">Score</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div
          className="h-2 overflow-hidden rounded-full bg-muted/50"
          role="progressbar"
          aria-valuenow={checklist.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Publish readiness score"
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-300",
              getProgressTone(checklist.score),
            )}
            style={{ width: `${checklist.score}%` }}
          />
        </div>
        <p className={cn("font-medium text-xs", getScoreTone(checklist.score))}>
          {checklist.statusLabel}
          {!checklist.requiredComplete ? " — required items missing" : null}
        </p>
      </div>

      <ul className="mt-4 space-y-3 border-[color:var(--separator)] border-t pt-4">
        {checklist.items.map((item) => (
          <ChecklistRow
            key={item.id}
            label={item.label}
            hint={item.hint}
            completed={item.completed}
            required={item.required}
          />
        ))}
      </ul>
    </GlassSurface>
  );
}
