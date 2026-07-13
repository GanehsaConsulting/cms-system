interface PricesListEmptyStateProps {
  title?: string;
  description?: string;
}

export function PricesListEmptyState({
  title = "No price plans yet",
  description = "Create your first pricing plan for the company profile website.",
}: PricesListEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-[var(--radius-deep)] border border-dashed border-[color:var(--separator)] bg-card/40 p-10 text-center">
      <p className="font-medium text-sm">{title}</p>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
