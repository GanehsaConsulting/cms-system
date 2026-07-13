import { ArticleAuthorAvatar } from "@/components/cms/articles/article-author-avatar";

interface ArticleAuthorCellProps {
  name: string;
}

export function ArticleAuthorCell({ name }: ArticleAuthorCellProps) {
  return (
    <div className="flex min-w-[9rem] items-center gap-2">
      <ArticleAuthorAvatar name={name} />
      <span className="truncate text-sm">{name}</span>
    </div>
  );
}
