interface BannersListEmptyStateProps {
  title?: string;
  description?: string;
}

export function BannersListEmptyState({
  title = "No banners yet",
  description = "Create a banner with a unique key so any page can load it by key.",
}: BannersListEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-(--radius-deep) border border-dashed border-(--separator) bg-card/40 p-10 text-center">
      <p className="font-medium text-sm">{title}</p>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
