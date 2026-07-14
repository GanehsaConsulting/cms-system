import { BannerPlacementSlotPreview } from "@/components/cms/banners/banner-placement-slot-preview";
import { cn } from "@/lib/utils";

interface BannerPlacementMockMegaMenuProps {
  images?: string[];
  className?: string;
}

export function BannerPlacementMockMegaMenu({
  images = [],
  className,
}: BannerPlacementMockMegaMenuProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-16/10 flex-col gap-1.5 rounded-xl border border-black/8 bg-[#f4f4f5] p-2 dark:border-white/10 dark:bg-[#2c2c2e]",
        className,
      )}
    >
      <div className="flex h-2 items-center gap-1">
        <span className="h-1.5 w-5 rounded-full bg-black/15 dark:bg-white/20" />
        <span className="h-1 w-4 rounded-full bg-black/20 dark:bg-white/30" />
        <span className="h-1 w-4 rounded-full bg-black/10 dark:bg-white/12" />
        <span className="h-1 w-4 rounded-full bg-black/10 dark:bg-white/12" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1fr_0.9fr] gap-1.5 rounded-lg bg-white/80 p-1.5 shadow-sm dark:bg-white/8">
        <div className="space-y-1">
          <span className="block h-1 w-8 rounded-full bg-black/15 dark:bg-white/20" />
          <span className="block h-1 w-full rounded-full bg-black/8 dark:bg-white/10" />
          <span className="block h-1 w-[85%] rounded-full bg-black/8 dark:bg-white/10" />
          <span className="block h-1 w-[80%] rounded-full bg-black/8 dark:bg-white/10" />
        </div>
        <div className="space-y-1">
          <span className="block h-1 w-7 rounded-full bg-black/15 dark:bg-white/20" />
          <span className="block h-1 w-full rounded-full bg-black/8 dark:bg-white/10" />
          <span className="block h-1 w-[85%] rounded-full bg-black/8 dark:bg-white/10" />
        </div>
        <BannerPlacementSlotPreview
          images={images}
          className="rounded-md ring-1 ring-[#93c5fd]/60 dark:ring-[#60a5fa]/35"
          emptyClassName="flex items-center justify-center rounded-md bg-[#dbeafe] ring-1 ring-[#93c5fd]/60 dark:bg-[#1e3a5f]/55 dark:ring-[#60a5fa]/35"
        >
          <span className="h-5 w-5 rounded-sm bg-[#93c5fd]/70 dark:bg-[#60a5fa]/45" />
        </BannerPlacementSlotPreview>
      </div>
    </div>
  );
}
