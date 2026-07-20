import { ArticleAuthorAvatar } from "@/components/cms/articles/article-author-avatar";
import { ArticleCategoryBadge } from "@/components/cms/articles/article-category-badge";
import { ArticleTagList } from "@/components/cms/articles/article-tag-list";
import { formatArticleDate } from "@/lib/articles/list";
import type { Article } from "@/types/article";

interface ArticleDetailTabDetailProps {
  article: Article;
}

export function ArticleDetailTabDetail({
  article,
}: ArticleDetailTabDetailProps) {
  return (
    <dl className="mt-4 space-y-4 text-sm">
      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Author</dt>
        <dd className="flex items-center gap-2">
          <ArticleAuthorAvatar
            name={article.authorName}
            avatarUrl={article.authorImage}
            size="md"
          />
          <span>{article.authorName}</span>
        </dd>
      </div>

      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Category</dt>
        <dd>
          <ArticleCategoryBadge categoryId={article.category} />
        </dd>
      </div>

      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Tags</dt>
        <dd>
          <ArticleTagList tags={article.tags} />
        </dd>
      </div>

      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Updated</dt>
        <dd>{formatArticleDate(article.updatedAt)}</dd>
      </div>

      {article.status === "scheduled" && article.publishedAt ? (
        <div className="space-y-1.5">
          <dt className="text-muted-foreground">Scheduled for</dt>
          <dd>{formatArticleDate(article.publishedAt)}</dd>
        </div>
      ) : null}

      {article.status === "published" && article.publishedAt ? (
        <div className="space-y-1.5">
          <dt className="text-muted-foreground">Published</dt>
          <dd>{formatArticleDate(article.publishedAt)}</dd>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Created</dt>
        <dd>{formatArticleDate(article.createdAt)}</dd>
      </div>

      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Slug</dt>
        <dd className="font-mono text-muted-foreground text-xs">
          /{article.slug}
        </dd>
      </div>
    </dl>
  );
}
