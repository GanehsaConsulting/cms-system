"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArticleAuthorAvatar } from "@/components/cms/articles/article-author-avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ARTICLE_AUTHORS } from "@/config/article-authors";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormAuthorFieldProps {
  control: Control<ArticleFormValues>;
}

export function ArticleFormAuthorField({ control }: ArticleFormAuthorFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="authorName">Author</Label>
      <Controller
        control={control}
        name="authorName"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id="authorName"
              className="h-8 w-full gap-2 px-2.5 py-0"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <ArticleAuthorAvatar name={field.value} size="xs" />
                <span className="truncate text-left">{field.value}</span>
              </span>
            </SelectTrigger>
            <SelectContent className="p-1">
              {ARTICLE_AUTHORS.map((authorName) => (
                <SelectItem
                  key={authorName}
                  value={authorName}
                  className="justify-start py-1.5 pr-8 pl-2"
                >
                  <ArticleAuthorAvatar name={authorName} size="xs" />
                  <span className="text-left">{authorName}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
