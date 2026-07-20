import Image from "next/image";
import { RADIUS_DEEP } from "@/config/shape";
import { getArticleThumbnailGradient } from "@/lib/articles/list";
import { cn } from "@/lib/utils";

interface ArticleThumbnailProps {
  articleId: string;
  title: string;
  /** Real thumbnail URL when available — falls back to letter placeholder. */
  src?: string | null;
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
  src,
  size = "sm",
  className,
}: ArticleThumbnailProps) {
  const imageSrc = src?.trim() || "";
  const initial = title.trim().charAt(0).toUpperCase() || "A";

  if (imageSrc) {
    return (
      <div
        className={cn(
          RADIUS_DEEP,
          "relative shrink-0 overflow-hidden bg-muted shadow-sm",
          sizeClasses[size],
          className,
        )}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes={
            size === "sm"
              ? "40px"
              : "(max-width: 768px) 100vw, 288px"
          }
          className="object-cover"
          unoptimized={
            !imageSrc.includes("res.cloudinary.com") &&
            !imageSrc.startsWith("/")
          }
        />
      </div>
    );
  }

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
