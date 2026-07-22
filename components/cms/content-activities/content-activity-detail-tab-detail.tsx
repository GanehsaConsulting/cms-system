import { ContentActivityDetailCover } from "@/components/cms/content-activities/content-activity-detail-cover";
import { CmsDetailMetaGroup } from "@/components/shared/cms-detail-meta-group";
import { CmsDetailMetaRow } from "@/components/shared/cms-detail-meta-row";
import {
  formatContentActivityDate,
  stripContentActivityHtml,
} from "@/lib/content-activities/list";
import type { ContentActivity } from "@/types/content-activity";

interface ContentActivityDetailTabDetailProps {
  item: ContentActivity;
}

export function ContentActivityDetailTabDetail({
  item,
}: ContentActivityDetailTabDetailProps) {
  const plainContent = stripContentActivityHtml(item.content);
  const description = item.excerpt.trim() || plainContent;

  return (
    <div className="space-y-4">
      <ContentActivityDetailCover images={item.images} />

      <CmsDetailMetaGroup label="Overview">
        <CmsDetailMetaRow label="Show title">
          {item.showTitle ? "Yes" : "No"}
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Display date">
          {formatContentActivityDate(item.displayAt)}
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Clicks">
          {item.clickCount.toLocaleString("en-US")}
        </CmsDetailMetaRow>
        <CmsDetailMetaRow
          label={item.kind === "promo" ? "Promo link" : "Instagram URL"}
          stacked={Boolean(item.linkUrl)}
          showDivider={false}
        >
          {item.linkUrl ? (
            <a
              href={item.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-medium text-primary hover:underline"
            >
              {item.linkUrl}
            </a>
          ) : (
            "—"
          )}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>

      {description ? (
        <CmsDetailMetaGroup label="Description">
          <CmsDetailMetaRow label="Copy" stacked showDivider={false}>
            <span className="text-muted-foreground whitespace-pre-wrap">
              {description}
            </span>
          </CmsDetailMetaRow>
        </CmsDetailMetaGroup>
      ) : null}

      <CmsDetailMetaGroup>
        <CmsDetailMetaRow label="Author">{item.authorName}</CmsDetailMetaRow>
        <CmsDetailMetaRow label="Updated" showDivider={false}>
          {formatContentActivityDate(item.updatedAt)}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>
    </div>
  );
}
