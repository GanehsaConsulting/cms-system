"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { CaretUpIcon } from "@/lib/icons";
import {
  ArticleFormCharCounter,
  ArticleFormField,
} from "@/components/cms/articles/article-form-field";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
    <SolidSurface className="p-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-start justify-between gap-2 text-left">
          <CmsFormSectionHeading
            title="SEO"
            description="Optional search metadata for search engines."
            accent="seo"
            className="flex-1"
          />
          <CaretUpIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
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
    </SolidSurface>
  );
}
