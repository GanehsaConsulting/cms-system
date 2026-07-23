import { BannerPlacementSlotPreview } from "@/components/cms/banners/banner-placement-slot-preview";
import { cn } from "@/lib/utils";

interface BannerPlacementMockCtaProps {
  images?: string[];
  className?: string;
}

export function BannerPlacementMockCta({
  images = [],
  className,
}: BannerPlacementMockCtaProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-16/10 flex-col justify-center gap-2 rounded-xl border border-black/8 bg-[#f4f4f5] p-2.5 dark:border-white/10 dark:bg-[#2c2c2e]",
        className,
      )}
    >
      <div className="space-y-1 opacity-45">
        <span className="block h-1 w-[55%] rounded-full bg-black/12 dark:bg-white/14" />
        <span className="block h-1 w-[40%] rounded-full bg-black/10 dark:bg-white/12" />
      </div>
      <BannerPlacementSlotPreview
        images={images}
        className="h-12 rounded-lg ring-1 ring-[#86efac]/70 dark:ring-[#4ade80]/35"
        emptyClassName="flex h-12 flex-col items-center justify-center gap-1.5 rounded-lg bg-[#dcfce7] ring-1 ring-[#86efac]/70 dark:bg-[#14532d]/45 dark:ring-[#4ade80]/35"
      >
        <span className="h-1.5 w-16 rounded-full bg-[#86efac]/90 dark:bg-[#4ade80]/55" />
        <span className="h-3 w-10 rounded-md bg-[#22c55e]/80 dark:bg-[#4ade80]/45" />
      </BannerPlacementSlotPreview>
    </div>
  );
}
