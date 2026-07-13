interface ClientsListHeaderProps {
  title?: string;
  description?: string;
}

export function ClientsListHeader({
  title = "Clients",
  description = "Central source of truth for client logos, testimonials, and gallery assets.",
}: ClientsListHeaderProps) {
  return (
    <div className="min-w-0">
      <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
