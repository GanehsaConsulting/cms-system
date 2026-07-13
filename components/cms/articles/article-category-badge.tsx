import { getArticleCategory, type ArticleCategoryStyle } from "@/config/article-categories";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ArticleCategoryBadgeProps {
  categoryId: string;
  className?: string;
  categoryStyle?: ArticleCategoryStyle;
}

export function ArticleCategoryBadge({
  categoryId,
  className,
  categoryStyle,
}: ArticleCategoryBadgeProps) {
  const category = categoryStyle ?? getArticleCategory(categoryId);

  return (
    <span
      className={cn(
        RADIUS_DEEP,
        "inline-flex items-center px-2 py-0.5 font-medium text-xs",
        category.badgeClassName,
        className,
      )}
    >
      {category.label}
    </span>
  );
}
