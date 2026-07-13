"use client";

import { useState } from "react";
import { XIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArticleFormCharCounter,
  ArticleFormField,
} from "@/components/cms/articles/article-form-field";
import { ARTICLE_FORM_LIMITS } from "@/config/article-form";

interface ArticleFormTagsFieldProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

export function ArticleFormTagsField({
  value,
  onChange,
  error,
}: ArticleFormTagsFieldProps) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (!tag || value.includes(tag) || value.length >= ARTICLE_FORM_LIMITS.maxTags) {
      return;
    }

    onChange([...value, tag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((item) => item !== tag));
  }

  return (
    <ArticleFormField
      id="tags"
      label="Tags"
      counter={ArticleFormCharCounter({
        current: value.length,
        max: ARTICLE_FORM_LIMITS.maxTags,
      })}
      hint="Press Enter to add tags"
      error={error}
    >
      <div className="space-y-2">
        <Input
          id="tags"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add tags..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag(draft);
            }
          }}
        />
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {value.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-4"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => removeTag(tag)}
                >
                  <XIcon className="size-2.5" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </ArticleFormField>
  );
}
