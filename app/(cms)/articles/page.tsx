import { Suspense } from "react";
import { ArticlesListHeader } from "@/components/cms/articles/articles-list-header";
import { ArticlesListView } from "@/components/cms/articles/articles-list-view";
import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { mergeArticleCategories } from "@/lib/articles/categories";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getArticlesList } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";
import { cn } from "@/lib/utils";

export default function ArticlesPage() {
  return (
    <CmsPageHeaderActionsProvider>
      <CmsSectionLayout
        header={
          <header className="mb-4 shrink-0">
            <ArticlesListHeader />
          </header>
        }
      >
        <Suspense
          fallback={
            <BodyFrame>
              <CmsListBodySkeleton withToolbar={false} />
            </BodyFrame>
          }
        >
          <ArticlesPageContent />
        </Suspense>
      </CmsSectionLayout>
    </CmsPageHeaderActionsProvider>
  );
}

function BodyFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      {children}
    </div>
  );
}

async function ArticlesPageContent() {
  const brand = await requireCmsNavHref("/articles");
  const [articles, customCategories] = await Promise.all([
    getArticlesList(brand.id),
    getCustomCategories(brand.id),
  ]);
  const categories = mergeArticleCategories(customCategories);

  return (
    <BodyFrame>
      <ArticlesListView articles={articles} categories={categories} />
    </BodyFrame>
  );
}
