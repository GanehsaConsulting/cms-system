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
import type { ArticleAuthorOption } from "@/lib/articles/authors";
import { toSelectItems } from "@/lib/select-items";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormAuthorFieldProps {
  control: Control<ArticleFormValues>;
  authors: ArticleAuthorOption[];
}

export function ArticleFormAuthorField({
  control,
  authors,
}: ArticleFormAuthorFieldProps) {
  const items = toSelectItems(
    authors.map((author) => ({ id: author.name, label: author.name })),
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="authorName">Author</Label>
      <Controller
        control={control}
        name="authorName"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            items={items}
          >
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
              {authors.map((author) => (
                <SelectItem
                  key={author.id}
                  value={author.name}
                  className="justify-start py-1.5 pr-8 pl-2"
                >
                  <ArticleAuthorAvatar name={author.name} size="xs" />
                  <span className="text-left">{author.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
