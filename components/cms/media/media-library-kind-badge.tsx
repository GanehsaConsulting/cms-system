import { MediaLibraryKindIcon } from "@/components/cms/media/media-library-kind-icon";
import { cn } from "@/lib/utils";
import type { MediaKind } from "@/types/media";
import { formatMediaKindLabel } from "@/lib/media/list";

interface MediaLibraryKindBadgeProps {
  kind: MediaKind;
  className?: string;
}

const kindStyles: Record<MediaKind, string> = {
  image: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  video: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  document: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  other: "bg-muted text-muted-foreground",
};

export function MediaLibraryKindBadge({
  kind,
  className,
}: MediaLibraryKindBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[11px]",
        kindStyles[kind],
        className,
      )}
    >
      <MediaLibraryKindIcon kind={kind} className="size-3" />
      {formatMediaKindLabel(kind)}
    </span>
  );
}
