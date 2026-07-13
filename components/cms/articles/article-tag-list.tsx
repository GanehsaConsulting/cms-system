import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ArticleTagListProps {
  tags: string[];
  maxVisible?: number;
}

export function ArticleTagList({ tags, maxVisible = 3 }: ArticleTagListProps) {
  if (tags.length === 0) {
    return <span className="text-muted-foreground text-sm">No tags</span>;
  }

  const visible = tags.slice(0, maxVisible);
  const hiddenCount = tags.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag) => (
        <span
          key={tag}
          className={cn(
            RADIUS_DEEP,
            "bg-muted px-2 py-0.5 text-muted-foreground text-xs",
          )}
        >
          {tag}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span
          className={cn(
            RADIUS_DEEP,
            "bg-muted px-2 py-0.5 text-muted-foreground text-xs",
          )}
        >
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  );
}
