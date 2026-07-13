import { getAuthorInitials } from "@/lib/articles/list";
import { cn } from "@/lib/utils";

interface ArticleAuthorAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const sizeClasses = {
  xs: "size-5 text-[9px]",
  sm: "size-7 text-[10px]",
  md: "size-8 text-xs",
} as const;

export function ArticleAuthorAvatar({
  name,
  size = "sm",
  className,
}: ArticleAuthorAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary",
        sizeClasses[size],
        className,
      )}
    >
      {getAuthorInitials(name)}
    </span>
  );
}
