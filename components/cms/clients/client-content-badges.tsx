import { Badge } from "@/components/ui/badge";
import {
  CLIENT_CONTENT_KIND_BADGE_CLASSES,
  CLIENT_CONTENT_KIND_LABELS,
  type ClientContentKind,
} from "@/config/client-content-kinds";
import { cn } from "@/lib/utils";

interface ClientContentBadgesProps {
  kinds: ClientContentKind[];
  className?: string;
}

export function ClientContentBadges({
  kinds,
  className,
}: ClientContentBadgesProps) {
  if (kinds.length === 0) {
    return (
      <span className="text-muted-foreground text-xs">No content</span>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {kinds.map((kind) => (
        <Badge
          key={kind}
          variant="outline"
          className={cn("rounded-md", CLIENT_CONTENT_KIND_BADGE_CLASSES[kind])}
        >
          {CLIENT_CONTENT_KIND_LABELS[kind]}
        </Badge>
      ))}
    </div>
  );
}
