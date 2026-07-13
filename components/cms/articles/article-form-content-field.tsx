"use client";

import { ArticleEditor } from "@/components/cms/article-editor";
import { ArticleFormField } from "@/components/cms/articles/article-form-field";

interface ArticleFormContentFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function ArticleFormContentField({
  value,
  error,
  onChange,
}: ArticleFormContentFieldProps) {
  return (
    <ArticleFormField
      id="content"
      label="Article Content"
      required
      error={error}
    >
      <ArticleEditor value={value} onChange={onChange} />
    </ArticleFormField>
  );
}
