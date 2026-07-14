import { BannerPlacementSlotPreview } from "@/components/cms/banners/banner-placement-slot-preview";
import { cn } from "@/lib/utils";

interface BannerPlacementMockHomepageProps {
  images?: string[];
  className?: string;
}

export function BannerPlacementMockHomepage({
  images = [],
  className,
}: BannerPlacementMockHomepageProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-16/10 flex-col gap-1.5 rounded-xl border border-black/8 bg-[#f4f4f5] p-2.5 dark:border-white/10 dark:bg-[#2c2c2e]",
        className,
      )}
    >
      <div className="flex h-2 items-center gap-1">
        <span className="h-1.5 w-6 rounded-full bg-black/15 dark:bg-white/20" />
        <span className="ml-auto h-1 w-8 rounded-full bg-black/10 dark:bg-white/12" />
        <span className="h-1 w-5 rounded-full bg-black/10 dark:bg-white/12" />
      </div>
      <BannerPlacementSlotPreview
        images={images}
        className="min-h-0 flex-1 rounded-lg ring-1 ring-[#93c5fd]/60 dark:ring-[#60a5fa]/35"
        emptyClassName="flex min-h-0 flex-1 items-center justify-center rounded-lg bg-[#dbeafe] ring-1 ring-[#93c5fd]/60 dark:bg-[#1e3a5f]/55 dark:ring-[#60a5fa]/35"
      >
        <span className="h-2 w-16 rounded-full bg-[#93c5fd]/80 dark:bg-[#60a5fa]/50" />
      </BannerPlacementSlotPreview>
      <div className="grid grid-cols-3 gap-1">
        <span className="h-4 rounded-md bg-black/8 dark:bg-white/10" />
        <span className="h-4 rounded-md bg-black/8 dark:bg-white/10" />
        <span className="h-4 rounded-md bg-black/8 dark:bg-white/10" />
      </div>
    </div>
  );
}
