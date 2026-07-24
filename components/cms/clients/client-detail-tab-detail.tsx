import { ClientDetailLogoPreview } from "@/components/cms/clients/client-detail-logo-preview";
import { ClientFeaturedBadge } from "@/components/cms/clients/client-featured-badge";
import { CmsDetailMetaGroup } from "@/components/shared/cms-detail-meta-group";
import { CmsDetailMetaRow } from "@/components/shared/cms-detail-meta-row";
import { formatClientDate } from "@/lib/clients/list";
import type { ClientListPreviewMode } from "@/lib/clients/preview";
import type { Client } from "@/types/client";

interface ClientDetailTabDetailProps {
  client: Client;
  previewMode?: ClientListPreviewMode;
}

export function ClientDetailTabDetail({
  client,
  previewMode = "auto",
}: ClientDetailTabDetailProps) {
  return (
    <div className={previewMode === "photo" ? "mt-4 space-y-4" : "space-y-4"}>
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
        <CmsDetailMetaRow
          label="Logo"
          stacked={previewMode === "logo" && Boolean(client.logo)}
          showDivider={false}
        >
          {previewMode === "logo" && client.logo ? (
            <ClientDetailLogoPreview logo={client.logo} title={client.name} />
          ) : client.logo ? (
            "Uploaded"
          ) : (
            "—"
          )}
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
