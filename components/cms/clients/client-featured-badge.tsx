export function ClientFeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) {
    return (
      <span className="text-muted-foreground text-xs">Standard</span>
    );
  }

  return (
    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
      Featured
    </span>
  );
}
