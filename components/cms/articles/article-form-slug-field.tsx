import { ArticleFormField } from "@/components/cms/articles/article-form-field";
import { ARTICLE_SITE_BASE_URL } from "@/config/article-form";
import { slugifyArticleTitle } from "@/lib/articles/slug";
import { cn } from "@/lib/utils";

interface ArticleFormSlugFieldProps {
  title: string;
}

const slugContainerClass = cn(
  "flex min-h-8 w-full min-w-0 cursor-default items-center rounded-lg border border-border/70 bg-muted/25 px-2.5 py-1 text-sm",
  "dark:border-input/50 dark:bg-muted/20",
);

export function ArticleFormSlugField({ title }: ArticleFormSlugFieldProps) {
  const slug = slugifyArticleTitle(title);

  return (
    <ArticleFormField
      id="slug"
      label="Slug (URL)"
      hint="Auto-generated from the article title."
    >
      <div
        id="slug"
        aria-readonly
        className={slugContainerClass}
      >
        <p className="break-all leading-relaxed">
          <span className="text-muted-foreground/80">{ARTICLE_SITE_BASE_URL}</span>
          <span className="text-muted-foreground">{slug || "—"}</span>
        </p>
      </div>
    </ArticleFormField>
  );
}
