import { getMediaKindIcon } from "@/lib/media/icons";
import type { MediaKind } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryKindIconProps {
  kind: MediaKind;
  className?: string;
}

export function MediaLibraryKindIcon({
  kind,
  className,
}: MediaLibraryKindIconProps) {
  const Icon = getMediaKindIcon(kind);

  return <Icon className={cn("size-4 shrink-0", className)} aria-hidden />;
}
