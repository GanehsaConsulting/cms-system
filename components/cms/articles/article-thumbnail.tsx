import { RADIUS_DEEP } from "@/config/shape";
import { getArticleThumbnailGradient } from "@/lib/articles/list";
import { cn } from "@/lib/utils";

interface ArticleThumbnailProps {
  articleId: string;
  title: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: "size-10 text-[10px]",
  md: "h-36 w-full text-sm",
} as const;

export function ArticleThumbnail({
  articleId,
  title,
  size = "sm",
  className,
}: ArticleThumbnailProps) {
  const initial = title.trim().charAt(0).toUpperCase() || "A";

  return (
    <div
      aria-hidden
      className={cn(
        RADIUS_DEEP,
        "flex shrink-0 items-center justify-center bg-linear-to-br font-semibold text-white shadow-sm",
        getArticleThumbnailGradient(articleId),
        sizeClasses[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
