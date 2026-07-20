import { ArticleAuthorAvatar } from "@/components/cms/articles/article-author-avatar";

interface ArticleAuthorCellProps {
  name: string;
  avatarUrl?: string | null;
}

export function ArticleAuthorCell({ name, avatarUrl }: ArticleAuthorCellProps) {
  return (
    <div className="flex min-w-[9rem] items-center gap-2">
      <ArticleAuthorAvatar name={name} avatarUrl={avatarUrl} />
      <span className="truncate text-sm">{name}</span>
    </div>
  );
}
