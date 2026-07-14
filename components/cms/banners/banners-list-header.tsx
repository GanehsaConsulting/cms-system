interface BannersListHeaderProps {
  title?: string;
  description?: string;
}

export function BannersListHeader({
  title = "Banners",
  description = "Manage where your banners appear across the website.",
}: BannersListHeaderProps) {
  return (
    <div className="min-w-0">
      <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
