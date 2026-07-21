import { ArticlesListHeader } from "@/components/cms/articles/articles-list-header";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <CmsSectionLayout
      header={
        <header className="mb-4 shrink-0">
          <ArticlesListHeader />
        </header>
      }
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SECTION_BODY_PADDING,
        )}
      >
        <CmsListBodySkeleton />
      </div>
    </CmsSectionLayout>
  );
}
