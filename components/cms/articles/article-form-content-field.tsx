"use client";

import dynamic from "next/dynamic";
import { ArticleFormField } from "@/components/cms/articles/article-form-field";

const ArticleEditor = dynamic(
  () =>
    import("@/components/cms/article-editor").then((mod) => ({
      default: mod.ArticleEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="article-editor-wrapper min-h-[280px] rounded-md bg-muted/40"
        aria-hidden
      />
    ),
  },
);

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
