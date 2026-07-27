import { TRASH_COPY } from "@/config/trash";

export function TrashEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-(--radius-deep) border border-dashed border-(--separator) bg-card/40 p-10 text-center">
      <p className="font-medium text-sm">{TRASH_COPY.emptyTitle}</p>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm">
        {TRASH_COPY.emptyDescription}
      </p>
    </div>
  );
}
