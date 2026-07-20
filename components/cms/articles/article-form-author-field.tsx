"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArticleAuthorAvatar } from "@/components/cms/articles/article-author-avatar";
import { Label } from "@/components/ui/label";
import type { ArticleAuthorOption } from "@/lib/articles/authors";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormAuthorFieldProps {
  control: Control<ArticleFormValues>;
  author: ArticleAuthorOption;
}

export function ArticleFormAuthorField({
  control,
  author,
}: ArticleFormAuthorFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="authorName">Author</Label>
      <Controller
        control={control}
        name="authorName"
        render={({ field }) => (
          <>
            <input type="hidden" {...field} value={author.name} readOnly />
            <div
              id="authorName"
              className="flex h-8 w-full items-center gap-2 rounded-md border border-input bg-muted/30 px-2.5"
              aria-readonly="true"
            >
              <ArticleAuthorAvatar
                name={author.name}
                avatarUrl={author.image}
                size="xs"
              />
              <span className="truncate text-left text-sm">{author.name}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Articles are always attributed to your signed-in account.
            </p>
          </>
        )}
      />
    </div>
  );
}
