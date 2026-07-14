import { PORTFOLIO_WORK_TYPE_LABELS } from "@/config/clients-works";
import type { PortfolioWorkType } from "@/types/portfolio";

export function PortfolioWorkTypeBadge({
  workType,
}: {
  workType: PortfolioWorkType;
}) {
  return (
    <span className="rounded-md bg-black/6 px-2 py-0.5 font-medium text-xs dark:bg-white/10">
      {PORTFOLIO_WORK_TYPE_LABELS[workType]}
    </span>
  );
}
