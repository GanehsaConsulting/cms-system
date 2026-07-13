interface PricesListHeaderProps {
  title?: string;
  description?: string;
}

export function PricesListHeader({
  title = "Price Management",
  description = "Manage pricing plans for your company profile services.",
}: PricesListHeaderProps) {
  return (
    <div className="min-w-0">
      <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
