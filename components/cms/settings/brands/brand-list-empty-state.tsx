interface BrandListEmptyStateProps {
  onCreate: () => void;
}

export function BrandListEmptyState({ onCreate }: BrandListEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-(--radius-inner) border border-dashed border-(--separator) bg-card/40 p-10 text-center">
      <p className="font-medium text-sm">No brands yet</p>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
        Register a brand to control which CMS modules are available for that
        company profile.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-4 text-primary text-sm hover:underline"
      >
        Create your first brand
      </button>
    </div>
  );
}
