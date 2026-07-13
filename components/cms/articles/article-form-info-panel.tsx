import { CmsFormInfoPanel } from "@/components/shared/cms-form-info-panel";
import { formatArticleDate } from "@/lib/articles/list";
import type { Article } from "@/types/article";

interface ArticleFormInfoPanelProps {
  article?: Article;
  slug?: string;
  changedSections: string[];
  hasUnsavedChanges: boolean;
}

export function ArticleFormInfoPanel({
  article,
  slug,
  changedSections,
  hasUnsavedChanges,
}: ArticleFormInfoPanelProps) {
  return (
    <CmsFormInfoPanel
      createdAt={article?.createdAt}
      updatedAt={article?.updatedAt}
      slug={slug ?? article?.slug}
      formatDate={formatArticleDate}
      changedSections={changedSections}
      hasUnsavedChanges={hasUnsavedChanges}
      createHint="This article has not been saved yet. Fill in the required fields, then save a draft or publish."
      saveReminder="Remember to save so these updates appear on the public site."
      allSavedHint="No unsaved changes. You are viewing the latest saved version."
      genericDirtyHint="You have edited this article."
    />
  );
}
