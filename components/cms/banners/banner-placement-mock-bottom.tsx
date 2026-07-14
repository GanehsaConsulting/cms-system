import { BannerPlacementSlotPreview } from "@/components/cms/banners/banner-placement-slot-preview";
import { cn } from "@/lib/utils";

interface BannerPlacementMockBottomProps {
  images?: string[];
  className?: string;
}

export function BannerPlacementMockBottom({
  images = [],
  className,
}: BannerPlacementMockBottomProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-16/10 flex-col gap-1 rounded-xl border border-black/8 bg-[#f4f4f5] p-2 dark:border-white/10 dark:bg-[#2c2c2e]",
        className,
      )}
    >
      <div className="flex h-2 items-center gap-1">
        <span className="h-1.5 w-6 rounded-full bg-black/15 dark:bg-white/20" />
        <span className="ml-auto h-1 w-10 rounded-full bg-black/10 dark:bg-white/12" />
      </div>
      <div className="min-h-0 flex-1 space-y-1 opacity-50">
        <span className="block h-1 w-full rounded-full bg-black/10 dark:bg-white/12" />
        <span className="block h-1 w-[85%] rounded-full bg-black/10 dark:bg-white/12" />
        <span className="mt-1 block h-6 rounded-md bg-black/8 dark:bg-white/10" />
      </div>
      <BannerPlacementSlotPreview
        images={images}
        className="h-5 rounded-md ring-1 ring-[#93c5fd]/60 dark:ring-[#60a5fa]/35"
        emptyClassName="flex h-5 items-center justify-center rounded-md bg-[#dbeafe] ring-1 ring-[#93c5fd]/60 dark:bg-[#1e3a5f]/55 dark:ring-[#60a5fa]/35"
      >
        <span className="h-1.5 w-12 rounded-full bg-[#93c5fd]/80 dark:bg-[#60a5fa]/50" />
      </BannerPlacementSlotPreview>
    </div>
  );
}
