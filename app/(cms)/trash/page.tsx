import { Suspense } from "react";
import { TrashListHeader } from "@/components/cms/trash/trash-list-header";
import { TrashListView } from "@/components/cms/trash/trash-list-view";
import { CmsPageHeaderActionsProvider } from "@/components/shared/cms-page-header-actions";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getTrashedArticles } from "@/lib/db/articles";
import { getTrashedBanners } from "@/lib/db/banners";
import { getClientById, getTrashedClients } from "@/lib/db/clients";
import { getTrashedContentActivities } from "@/lib/db/content-activities";
import { getTrashedMediaLibraryFiles } from "@/lib/db/media-files";
import { getTrashedMediaFolders } from "@/lib/db/media-folders";
import { getTrashedPortfolioItems } from "@/lib/db/portfolio";
import { getTrashedPrices } from "@/lib/db/prices";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import { getCurrentCmsUser } from "@/lib/users/current";
import { isSuperAdmin } from "@/lib/users/permissions";
import type { TrashListItem } from "@/types/trash";
import { cn } from "@/lib/utils";

export default function TrashPage() {
  return (
    <CmsPageHeaderActionsProvider>
      <CmsSectionLayout header={<TrashListHeader />}>
        <Suspense
          fallback={
            <BodyFrame>
              <CmsListBodySkeleton withToolbar={false} />
            </BodyFrame>
          }
        >
          <TrashPageContent />
        </Suspense>
      </CmsSectionLayout>
    </CmsPageHeaderActionsProvider>
  );
}

function BodyFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      {children}
    </div>
  );
}

async function TrashPageContent() {
  const brand = await requireCmsNavHref("/trash");
  const user = await getCurrentCmsUser();
  const mediaInput = {
    brandId: brand.id,
    ownerUserId: user?.id ?? null,
  };

  const [
    clients,
    works,
    articles,
    prices,
    activities,
    banners,
    mediaFolders,
    mediaFiles,
  ] = await Promise.all([
    getTrashedClients(brand.id),
    getTrashedPortfolioItems(brand.id),
    getTrashedArticles(brand.id),
    getTrashedPrices(brand.id),
    getTrashedContentActivities(brand.id),
    getTrashedBanners(brand.id),
    getTrashedMediaFolders(mediaInput),
    getTrashedMediaLibraryFiles(mediaInput),
  ]);

  const trashedClientIds = new Set(clients.map((client) => client.id));
  const clientNameById = new Map(
    clients.map((client) => [client.id, client.name]),
  );

  const standaloneWorks = works.filter(
    (work) => work.deletedAt && !trashedClientIds.has(work.clientId),
  );

  const parentIds = [
    ...new Set(standaloneWorks.map((work) => work.clientId)),
  ];
  await Promise.all(
    parentIds.map(async (clientId) => {
      const client = await getClientById(brand.id, clientId, {
        includeDeleted: true,
      });
      if (client) {
        clientNameById.set(client.id, client.name);
      }
    }),
  );

  const trashedFolderIds = new Set(mediaFolders.map((folder) => folder.id));
  const rootMediaFolders = mediaFolders.filter(
    (folder) => !folder.parentId || !trashedFolderIds.has(folder.parentId),
  );
  const standaloneMediaFiles = mediaFiles.filter(
    (file) => file.deletedAt && !trashedFolderIds.has(file.folderId),
  );

  const items: TrashListItem[] = [
    ...clients
      .filter((client) => client.deletedAt)
      .map((client) => ({
        kind: "client" as const,
        id: client.id,
        title: client.name,
        thumb: client.logo || null,
        subtitle: "Client",
        deletedAt: client.deletedAt as string,
      })),
    ...standaloneWorks.map((work) => ({
      kind: "portfolio" as const,
      id: work.id,
      title: work.title,
      thumb: work.coverImage || null,
      subtitle: clientNameById.get(work.clientId)
        ? `Work · ${clientNameById.get(work.clientId)}`
        : "Work",
      deletedAt: work.deletedAt as string,
    })),
    ...articles
      .filter((article) => article.deletedAt)
      .map((article) => ({
        kind: "article" as const,
        id: article.id,
        title: article.title,
        thumb: article.thumbnail || null,
        subtitle: "Article",
        deletedAt: article.deletedAt as string,
      })),
    ...prices
      .filter((price) => price.deletedAt)
      .map((price) => ({
        kind: "price" as const,
        id: price.id,
        title: getPriceDisplayText(price.packageName) || "Price plan",
        thumb: null,
        subtitle: getPriceDisplayText(price.service) || "Price plan",
        deletedAt: price.deletedAt as string,
      })),
    ...activities
      .filter((activity) => activity.deletedAt)
      .map((activity) => ({
        kind: "activity" as const,
        id: activity.id,
        title: activity.title,
        thumb: activity.images[0] ?? null,
        subtitle: "Activity",
        deletedAt: activity.deletedAt as string,
      })),
    ...banners
      .filter((banner) => banner.deletedAt)
      .map((banner) => ({
        kind: "banner" as const,
        id: banner.id,
        title: banner.name,
        thumb: banner.images[0] ?? null,
        subtitle: `Banner · ${banner.key}`,
        deletedAt: banner.deletedAt as string,
      })),
    ...rootMediaFolders
      .filter((folder) => folder.deletedAt)
      .map((folder) => ({
        kind: "media-folder" as const,
        id: folder.id,
        title: folder.name,
        thumb: null,
        subtitle: `Folder · ${folder.scope}`,
        deletedAt: folder.deletedAt as string,
      })),
    ...standaloneMediaFiles.map((file) => ({
      kind: "media-file" as const,
      id: file.id,
      title: file.filename,
      thumb: file.kind === "image" ? file.url : null,
      subtitle: `File · ${file.scope}`,
      deletedAt: file.deletedAt as string,
    })),
  ].sort(
    (a, b) =>
      new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime(),
  );

  return (
    <BodyFrame>
      <TrashListView
        items={items}
        canPurgePermanently={isSuperAdmin(user)}
      />
    </BodyFrame>
  );
}
