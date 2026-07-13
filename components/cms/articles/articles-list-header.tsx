interface ArticlesListHeaderProps {
  title?: string;
  description?: string;
}

export function ArticlesListHeader({
  title = "Articles",
  description = "Manage all articles and site content.",
}: ArticlesListHeaderProps) {
  return (
    <div className="min-w-0">
      <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
