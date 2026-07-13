import type { Article } from "@/types/article";

interface ArticleDetailTabSeoProps {
  article: Article;
}

export function ArticleDetailTabSeo({ article }: ArticleDetailTabSeoProps) {
  return (
    <dl className="mt-4 space-y-4 text-sm">
      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Slug</dt>
        <dd className="font-mono text-xs">/{article.slug}</dd>
      </div>
      <div className="space-y-1.5">
        <dt className="text-muted-foreground">Meta description</dt>
        <dd className="text-foreground/90 leading-relaxed">
          {article.excerpt || "No excerpt yet."}
        </dd>
      </div>
    </dl>
  );
}
