import { BannerPlacementSlotPreview } from "@/components/cms/banners/banner-placement-slot-preview";
import { cn } from "@/lib/utils";

interface BannerPlacementMockPopupProps {
  images?: string[];
  className?: string;
}

export function BannerPlacementMockPopup({
  images = [],
  className,
}: BannerPlacementMockPopupProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex aspect-16/10 flex-col gap-1 rounded-xl border border-black/8 bg-[#f4f4f5] p-2 dark:border-white/10 dark:bg-[#2c2c2e]",
        className,
      )}
    >
      <div className="space-y-1 opacity-40">
        <span className="block h-1.5 w-10 rounded-full bg-black/20 dark:bg-white/25" />
        <span className="block h-1 w-full rounded-full bg-black/10 dark:bg-white/12" />
        <span className="block h-1 w-[80%] rounded-full bg-black/10 dark:bg-white/12" />
        <span className="mt-1 block h-8 rounded-md bg-black/8 dark:bg-white/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 dark:bg-black/45">
        <BannerPlacementSlotPreview
          images={images}
          className="h-[62%] w-[58%] rounded-lg shadow-md ring-1 ring-[#93c5fd]/70 dark:ring-[#60a5fa]/40"
          emptyClassName="flex h-[62%] w-[58%] flex-col items-center justify-center gap-1.5 rounded-lg bg-[#dbeafe] shadow-md ring-1 ring-[#93c5fd]/70 dark:bg-[#1e3a5f]/80 dark:ring-[#60a5fa]/40"
        >
          <span className="h-1.5 w-10 rounded-full bg-[#93c5fd] dark:bg-[#60a5fa]/60" />
          <span className="h-1 w-14 rounded-full bg-[#93c5fd]/70 dark:bg-[#60a5fa]/40" />
        </BannerPlacementSlotPreview>
      </div>
    </div>
  );
}
