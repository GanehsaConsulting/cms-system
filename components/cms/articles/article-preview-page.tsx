import { ArticleAuthorAvatar } from "@/components/cms/articles/article-author-avatar";
import { ArticleCategoryBadge } from "@/components/cms/articles/article-category-badge";
import { ArticleTagList } from "@/components/cms/articles/article-tag-list";
import { ArticleThumbnail } from "@/components/cms/articles/article-thumbnail";
import { formatArticleDate } from "@/lib/articles/list";
import type { ArticlePreviewData } from "@/types/article-preview";
import "./article-preview-page.scss";

interface ArticlePreviewPageProps {
  article: ArticlePreviewData;
  publishedAt?: string;
}

function hasArticleContent(content: string) {
  return content.replace(/<[^>]*>/g, "").trim().length > 0;
}

export function ArticlePreviewPage({
  article,
  publishedAt = new Date().toISOString(),
}: ArticlePreviewPageProps) {
  const title = article.title.trim() || "Untitled article";
  const previewId = article.slug || "preview";

  return (
    <article className="min-h-full bg-background/0 text-foreground">
      <div className="border-(--separator) border-b bg-card/50 px-6 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <ArticleCategoryBadge categoryId={article.category} />

          <h1 className="mt-4 font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <ArticleAuthorAvatar name={article.authorName} size="sm" />
              <span>{article.authorName}</span>
            </div>
            <span aria-hidden>·</span>
            <time dateTime={publishedAt}>{formatArticleDate(publishedAt)}</time>
          </div>

          {article.excerpt ? (
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed sm:text-xl">
              {article.excerpt}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-12">
        <ArticleThumbnail
          articleId={previewId}
          title={title}
          src={article.thumbnail}
          size="md"
          className="aspect-video h-auto w-full"
        />

        {hasArticleContent(article.content) ? (
          <div
            className="article-preview-prose mt-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <p className="mt-8 text-muted-foreground text-sm">
            Article content will appear here.
          </p>
        )}

        {article.tags.length > 0 ? (
          <div className="mt-10 border-(--separator) border-t pt-6 pb-16">
            <p className="mb-3 font-medium text-sm">Tags</p>
            <ArticleTagList tags={article.tags} maxVisible={10} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
