import Image from "next/image";
import { RADIUS_DEEP, RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ContentActivityDetailCoverProps {
  images: string[];
}

export function ContentActivityDetailCover({
  images,
}: ContentActivityDetailCoverProps) {
  if (images.length === 0) {
    return null;
  }

  const [cover, ...rest] = images;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          RADIUS_INNER,
          "relative h-36 w-full overflow-hidden bg-muted shadow-sm",
        )}
      >
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover"
          unoptimized
        />
      </div>

      {rest.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {rest.slice(0, 4).map((image) => (
            <div
              key={image}
              className={cn(
                RADIUS_DEEP,
                "relative size-14 shrink-0 overflow-hidden bg-muted",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
          {rest.length > 4 ? (
            <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
              +{rest.length - 4}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
