interface ClientsListEmptyStateProps {
  title?: string;
  description?: string;
}

export function ClientsListEmptyState({
  title = "No clients yet",
  description = "Add your first client to manage logos, testimonials, and gallery photos in one place.",
}: ClientsListEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-(--radius-deep) border border-dashed border-(--separator) bg-card/40 p-10 text-center">
      <p className="font-medium text-sm">{title}</p>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
