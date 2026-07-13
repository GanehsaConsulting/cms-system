import { CheckIcon } from "@/lib/icons";
import {
  calculateDiscountPercent,
  formatPriceDisplayIdr,
} from "@/lib/prices/format";
import type { PricePreviewData } from "@/types/price-preview";
import { cn } from "@/lib/utils";

interface PricePreviewCardProps {
  data: PricePreviewData;
  className?: string;
}

export function PricePreviewCard({ data, className }: PricePreviewCardProps) {
  const hasWhatsApp = data.whatsappLink.trim().length > 0;
  const features = data.features.filter((feature) => feature.trim().length > 0);
  const title = data.title.trim() || "Untitled package";
  const discount = calculateDiscountPercent(
    data.price,
    data.strikethroughPrice,
  );
  const showGimmick = discount > 0;
  const isHighlighted = data.highlighted;

  return (
    <article
      className={cn(
        "flex w-full max-w-sm flex-col overflow-hidden rounded-[1.75rem]",
        "border bg-white text-[#1d1d1f]",
        "shadow-[0_2px_8px_rgb(0_0_0/0.04),0_12px_40px_rgb(0_0_0/0.08)]",
        "dark:bg-[#1c1c1e] dark:text-[#f5f5f7]",
        "dark:shadow-[0_2px_8px_rgb(0_0_0/0.35),0_16px_48px_rgb(0_0_0/0.45)]",
        isHighlighted
          ? "border-[#007aff] dark:border-[#0a84ff]"
          : "border-black/5 dark:border-white/8",
        className,
      )}
    >
      <div className="space-y-4 px-6 pt-6 pb-5">
        <div className="space-y-2">
          {isHighlighted ? (
            <p className="font-medium text-[0.6875rem] text-[#007aff] uppercase tracking-[0.06em] dark:text-[#0a84ff]">
              Most Popular
            </p>
          ) : null}
          <h3 className="font-semibold text-[1.125rem] leading-snug tracking-tight">
            {title}
          </h3>
        </div>

        <div className="border-[#d2d2d7] border-t pt-4 dark:border-[#38383a]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-[0.6875rem] text-[#86868b] uppercase tracking-[0.06em] dark:text-[#98989d]">
                Display price
              </p>
              <p className="mt-1.5 font-semibold text-[1.75rem] leading-none tracking-tight tabular-nums">
                {formatPriceDisplayIdr(data.price)}
              </p>
              {showGimmick ? (
                <p className="mt-2 text-[#86868b] text-sm tabular-nums line-through dark:text-[#98989d]">
                  {formatPriceDisplayIdr(data.strikethroughPrice)}
                </p>
              ) : null}
            </div>

            {showGimmick ? (
              <span className="shrink-0 rounded-full bg-[#ff3b30] px-2.5 py-1 font-semibold text-[0.7rem] text-white tabular-nums">
                −{discount}%
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-[#f5f5f7] px-4 pt-4 pb-4 dark:bg-[#2c2c2e]">
        <div className="flex-1 rounded-[1.15rem] bg-white/80 px-4 py-4 dark:bg-[#1c1c1e]/80">
          {features.length > 0 ? (
            <ul className="space-y-3.5">
              {features.map((feature, index) => (
                <li
                  key={`${index}-${feature}`}
                  className="flex items-start gap-2.5"
                >
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e8e8ed] dark:bg-[#3a3a3c]"
                    aria-hidden
                  >
                    <CheckIcon className="size-2.5 text-[#6e6e73] dark:text-[#a1a1a6]" />
                  </span>
                  <span className="text-[#6e6e73] text-sm leading-snug dark:text-[#a1a1a6]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#86868b] text-sm dark:text-[#98989d]">
              No features added yet.
            </p>
          )}
        </div>

        {hasWhatsApp ? (
          <a
            href={data.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-4 flex h-11 w-full items-center justify-center rounded-full",
              "bg-[#1d1d1f] font-semibold text-[0.9375rem] text-white tracking-tight",
              "transition-[opacity,transform] hover:opacity-90 active:scale-[0.98]",
              "dark:bg-white dark:text-[#1d1d1f]",
            )}
          >
            Get Started
          </a>
        ) : (
          <button
            type="button"
            disabled
            className={cn(
              "mt-4 flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full",
              "bg-[#d2d2d7] font-semibold text-[0.9375rem] text-[#86868b] tracking-tight",
              "dark:bg-[#3a3a3c] dark:text-[#636366]",
            )}
          >
            Get Started
          </button>
        )}
      </div>
    </article>
  );
}
