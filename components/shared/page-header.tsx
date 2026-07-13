interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-semibold text-base tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="truncate text-muted-foreground text-xs">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
