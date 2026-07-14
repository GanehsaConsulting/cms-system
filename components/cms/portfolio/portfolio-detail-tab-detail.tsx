import { PortfolioWorkTypeBadge } from "@/components/cms/portfolio/portfolio-work-type-badge";
import { CmsDetailMetaGroup } from "@/components/shared/cms-detail-meta-group";
import { CmsDetailMetaRow } from "@/components/shared/cms-detail-meta-row";
import { formatPortfolioDate } from "@/lib/portfolio/list";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioDetailTabDetailProps {
  item: Portfolio;
  clientName: string;
}

export function PortfolioDetailTabDetail({
  item,
  clientName,
}: PortfolioDetailTabDetailProps) {
  return (
    <div className="space-y-4">
      <CmsDetailMetaGroup label="Overview">
        <CmsDetailMetaRow label="Client">
          {clientName || "Unknown client"}
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Work type">
          <span className="inline-flex justify-end">
            <PortfolioWorkTypeBadge workType={item.workType} />
          </span>
        </CmsDetailMetaRow>
        <CmsDetailMetaRow
          label="URL"
          stacked={Boolean(item.url)}
          showDivider={false}
        >
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-medium text-primary hover:underline"
            >
              {item.url}
            </a>
          ) : (
            "—"
          )}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>

      {item.description ? (
        <CmsDetailMetaGroup label="Description">
          <CmsDetailMetaRow label="Copy" stacked showDivider={false}>
            <span className="text-muted-foreground whitespace-pre-wrap">
              {item.description}
            </span>
          </CmsDetailMetaRow>
        </CmsDetailMetaGroup>
      ) : null}

      <CmsDetailMetaGroup>
        <CmsDetailMetaRow label="Updated" showDivider={false}>
          {formatPortfolioDate(item.updatedAt)}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>
    </div>
  );
}
