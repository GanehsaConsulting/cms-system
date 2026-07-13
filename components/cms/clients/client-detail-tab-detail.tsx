import { ClientFeaturedBadge } from "@/components/cms/clients/client-featured-badge";
import { CmsDetailMetaGroup } from "@/components/shared/cms-detail-meta-group";
import { CmsDetailMetaRow } from "@/components/shared/cms-detail-meta-row";
import { formatClientDate } from "@/lib/clients/list";
import type { Client } from "@/types/client";

interface ClientDetailTabDetailProps {
  client: Client;
}

export function ClientDetailTabDetail({ client }: ClientDetailTabDetailProps) {
  return (
    <div className="space-y-4">
      <CmsDetailMetaGroup label="Overview">
        <CmsDetailMetaRow label="Website" stacked={Boolean(client.website)}>
          {client.website ? (
            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-medium text-primary hover:underline"
            >
              {client.website}
            </a>
          ) : (
            "—"
          )}
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Featured">
          <span className="inline-flex justify-end">
            <ClientFeaturedBadge featured={client.featured} />
          </span>
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Logo" showDivider={false}>
          {client.logo ? "Uploaded" : "—"}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>

      <CmsDetailMetaGroup label="Content">
        <CmsDetailMetaRow label="Testimonials">
          {client.testimonials.length}
        </CmsDetailMetaRow>
        <CmsDetailMetaRow label="Gallery" showDivider={false}>
          {client.photos.length}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>

      {client.description ? (
        <CmsDetailMetaGroup label="Description">
          <CmsDetailMetaRow label="Copy" stacked showDivider={false}>
            <span className="text-muted-foreground">{client.description}</span>
          </CmsDetailMetaRow>
        </CmsDetailMetaGroup>
      ) : null}

      <CmsDetailMetaGroup>
        <CmsDetailMetaRow label="Updated" showDivider={false}>
          {formatClientDate(client.updatedAt)}
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>
    </div>
  );
}
