"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { CaretUpIcon } from "@/lib/icons";
import {
  ArticleFormCharCounter,
  ArticleFormField,
} from "@/components/cms/articles/article-form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { GlassSurface } from "@/components/shared/glass-surface";
import { ARTICLE_FORM_LIMITS } from "@/config/article-form";

interface ArticleFormSeoPanelProps {
  metaTitle: string;
  metaDescription: string;
  metaTitleRegister: UseFormRegisterReturn;
  metaDescriptionRegister: UseFormRegisterReturn;
  metaTitleError?: string;
  metaDescriptionError?: string;
}

export function ArticleFormSeoPanel({
  metaTitle,
  metaDescription,
  metaTitleRegister,
  metaDescriptionRegister,
  metaTitleError,
  metaDescriptionError,
}: ArticleFormSeoPanelProps) {
  return (
    <GlassSurface className="p-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 text-left">
          <h2 className="font-semibold text-sm">SEO (Optional)</h2>
          <CaretUpIcon className="size-3.5 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <ArticleFormField
            id="metaTitle"
            label="Meta Title"
            counter={ArticleFormCharCounter({
              current: metaTitle.length,
              max: ARTICLE_FORM_LIMITS.metaTitle,
            })}
            error={metaTitleError}
          >
            <Input
              id="metaTitle"
              placeholder="Write meta title..."
              aria-invalid={Boolean(metaTitleError)}
              {...metaTitleRegister}
            />
          </ArticleFormField>

          <ArticleFormField
            id="metaDescription"
            label="Meta Description"
            counter={ArticleFormCharCounter({
              current: metaDescription.length,
              max: ARTICLE_FORM_LIMITS.metaDescription,
            })}
            error={metaDescriptionError}
          >
            <Textarea
              id="metaDescription"
              rows={3}
              placeholder="Write meta description..."
              aria-invalid={Boolean(metaDescriptionError)}
              {...metaDescriptionRegister}
            />
          </ArticleFormField>
        </CollapsibleContent>
      </Collapsible>
    </GlassSurface>
  );
}
