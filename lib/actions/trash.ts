"use server";

import { revalidatePath } from "next/cache";
import { toActionError } from "@/lib/actions/action-error";
import { recordActivityEvent } from "@/lib/activity/record";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import {
  getArticleById,
  purgeAllTrashedArticles,
  purgeArticle,
  restoreArticle,
} from "@/lib/db/articles";
import {
  getBannerById,
  purgeAllTrashedBanners,
  purgeBanner,
  restoreBanner,
} from "@/lib/db/banners";
import {
  getClientById,
  purgeAllTrashedClients,
  purgeClient,
  restoreClient,
} from "@/lib/db/clients";
import {
  getContentActivityById,
  purgeAllTrashedContentActivities,
  purgeContentActivity,
  restoreContentActivity,
} from "@/lib/db/content-activities";
import {
  getMediaLibraryFileById,
  purgeAllTrashedMediaLibraryFiles,
  purgeMediaLibraryFile,
  restoreMediaLibraryFile,
} from "@/lib/db/media-files";
import {
  getMediaFolderById,
  purgeAllTrashedMediaFolders,
  purgeMediaFolder,
  restoreMediaFolder,
} from "@/lib/db/media-folders";
import {
  getPortfolioById,
  purgeAllTrashedPortfolio,
  purgePortfolio,
  purgePortfolioByClientId,
  restorePortfolio,
  restorePortfolioByClientId,
} from "@/lib/db/portfolio";
import {
  getPriceById,
  purgeAllTrashedPrices,
  purgePrice,
  restorePrice,
} from "@/lib/db/prices";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import { getCurrentCmsUser } from "@/lib/users/current";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import type { TrashKind } from "@/types/trash";

function revalidateTrashPaths() {
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/prices");
  revalidatePath("/clients");
  revalidatePath("/clients/clients");
  revalidatePath("/clients/portfolio");
  revalidatePath("/activities");
  revalidatePath("/banners");
  revalidatePath("/media");
  revalidatePath("/trash");
  revalidateMediaLibraryCache();
}

async function requireTrashAccess() {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { ok: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { ok: false as const, error: brand.error };
  }

  return { ok: true as const, user: access.user, brandId: brand.brandId };
}

export async function restoreTrashItemAction(kind: TrashKind, id: string) {
  const access = await requireTrashAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    switch (kind) {
      case "client": {
        const current = await getClientById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return { success: false as const, error: "Client not found in Trash." };
        }
        await restoreClient(access.brandId, id);
        await restorePortfolioByClientId(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "client",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.name,
          href: "/clients/clients",
        });
        break;
      }
      case "portfolio": {
        const current = await getPortfolioById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return { success: false as const, error: "Work not found in Trash." };
        }
        const parent = await getClientById(access.brandId, current.clientId, {
          includeDeleted: true,
        });
        if (!parent) {
          return {
            success: false as const,
            error: "Cannot restore this work — its client no longer exists.",
          };
        }
        if (parent.deletedAt) {
          await restoreClient(access.brandId, parent.id);
        }
        await restorePortfolio(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "portfolio",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.title,
          href: "/clients/portfolio",
        });
        break;
      }
      case "article": {
        const current = await getArticleById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Article not found in Trash.",
          };
        }
        await restoreArticle(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "article",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.title,
          href: "/articles",
        });
        break;
      }
      case "price": {
        const current = await getPriceById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Price plan not found in Trash.",
          };
        }
        await restorePrice(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "price",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.packageName.en || current.packageName.id,
          href: "/prices",
        });
        break;
      }
      case "activity": {
        const current = await getContentActivityById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Activity not found in Trash.",
          };
        }
        await restoreContentActivity(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "content_activity",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.title,
          href: "/activities",
        });
        break;
      }
      case "banner": {
        const current = await getBannerById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Banner not found in Trash.",
          };
        }
        await restoreBanner(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "banner",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.name,
          href: "/banners",
        });
        break;
      }
      case "media-file": {
        const current = await getMediaLibraryFileById(id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return { success: false as const, error: "File not found in Trash." };
        }
        await restoreMediaLibraryFile(id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "media",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.filename,
          href: "/media",
        });
        break;
      }
      case "media-folder": {
        const current = await getMediaFolderById(id, { includeDeleted: true });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Folder not found in Trash.",
          };
        }
        await restoreMediaFolder(id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "media",
          entityId: id,
          action: "updated",
          actor: access.user,
          entityTitle: current.name,
          href: "/media",
        });
        break;
      }
      default:
        return { success: false as const, error: "Unknown item type." };
    }

    revalidateTrashPaths();
    return { success: true as const };
  } catch (error) {
    return toActionError(error, "Failed to restore item");
  }
}

export async function purgeTrashItemAction(kind: TrashKind, id: string) {
  const access = await requireTrashAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    switch (kind) {
      case "client": {
        const current = await getClientById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return { success: false as const, error: "Client not found in Trash." };
        }
        await purgePortfolioByClientId(access.brandId, id);
        await purgeClient(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "client",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.name,
          href: "/trash",
        });
        break;
      }
      case "portfolio": {
        const current = await getPortfolioById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return { success: false as const, error: "Work not found in Trash." };
        }
        await purgePortfolio(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "portfolio",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.title,
          href: "/trash",
        });
        break;
      }
      case "article": {
        const current = await getArticleById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Article not found in Trash.",
          };
        }
        await purgeArticle(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "article",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.title,
          href: "/trash",
        });
        break;
      }
      case "price": {
        const current = await getPriceById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Price plan not found in Trash.",
          };
        }
        await purgePrice(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "price",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.packageName.en || current.packageName.id,
          href: "/trash",
        });
        break;
      }
      case "activity": {
        const current = await getContentActivityById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Activity not found in Trash.",
          };
        }
        await purgeContentActivity(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "content_activity",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.title,
          href: "/trash",
        });
        break;
      }
      case "banner": {
        const current = await getBannerById(access.brandId, id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Banner not found in Trash.",
          };
        }
        await purgeBanner(access.brandId, id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "banner",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.name,
          href: "/trash",
        });
        break;
      }
      case "media-file": {
        const current = await getMediaLibraryFileById(id, {
          includeDeleted: true,
        });
        if (!current?.deletedAt) {
          return { success: false as const, error: "File not found in Trash." };
        }
        await purgeMediaLibraryFile(id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "media",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.filename,
          href: "/trash",
        });
        break;
      }
      case "media-folder": {
        const current = await getMediaFolderById(id, { includeDeleted: true });
        if (!current?.deletedAt) {
          return {
            success: false as const,
            error: "Folder not found in Trash.",
          };
        }
        await purgeMediaFolder(id);
        await recordActivityEvent({
          brandId: access.brandId,
          entityType: "media",
          entityId: id,
          action: "deleted",
          actor: access.user,
          entityTitle: current.name,
          href: "/trash",
        });
        break;
      }
      default:
        return { success: false as const, error: "Unknown item type." };
    }

    revalidateTrashPaths();
    return { success: true as const };
  } catch (error) {
    return toActionError(error, "Failed to permanently delete item");
  }
}

/** @deprecated Prefer restoreTrashItemAction */
export async function restoreTrashClientAction(id: string) {
  return restoreTrashItemAction("client", id);
}

/** @deprecated Prefer purgeTrashItemAction */
export async function purgeTrashClientAction(id: string) {
  return purgeTrashItemAction("client", id);
}

/** @deprecated Prefer restoreTrashItemAction */
export async function restoreTrashPortfolioAction(id: string) {
  return restoreTrashItemAction("portfolio", id);
}

/** @deprecated Prefer purgeTrashItemAction */
export async function purgeTrashPortfolioAction(id: string) {
  return purgeTrashItemAction("portfolio", id);
}

export async function restoreTrashItemsAction(
  items: Array<{ kind: TrashKind; id: string }>,
) {
  const unique = dedupeTrashItems(items);
  if (unique.length === 0) {
    return { success: false as const, error: "No items selected." };
  }

  let restoredCount = 0;
  for (const item of unique) {
    const result = await restoreTrashItemAction(item.kind, item.id);
    if (result.success) {
      restoredCount += 1;
    }
  }

  if (restoredCount === 0) {
    return {
      success: false as const,
      error: "Could not restore the selected items.",
    };
  }

  return { success: true as const, restoredCount };
}

export async function purgeTrashItemsAction(
  items: Array<{ kind: TrashKind; id: string }>,
) {
  const unique = dedupeTrashItems(items);
  if (unique.length === 0) {
    return { success: false as const, error: "No items selected." };
  }

  let purgedCount = 0;
  for (const item of unique) {
    const result = await purgeTrashItemAction(item.kind, item.id);
    if (result.success) {
      purgedCount += 1;
    }
  }

  if (purgedCount === 0) {
    return {
      success: false as const,
      error: "Could not permanently delete the selected items.",
    };
  }

  return { success: true as const, purgedCount };
}

function dedupeTrashItems(items: Array<{ kind: TrashKind; id: string }>) {
  const seen = new Set<string>();
  const unique: Array<{ kind: TrashKind; id: string }> = [];
  for (const item of items) {
    const kind = item.kind;
    const id = item.id.trim();
    if (!kind || !id) {
      continue;
    }
    const key = `${kind}:${id}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push({ kind, id });
  }
  return unique;
}

export async function emptyTrashAction() {
  const access = await requireTrashAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    const user = await getCurrentCmsUser();
    const mediaInput = {
      brandId: access.brandId,
      ownerUserId: user?.id ?? null,
    };

    const [
      articlesPurged,
      pricesPurged,
      activitiesPurged,
      bannersPurged,
    ] = await Promise.all([
      purgeAllTrashedArticles(access.brandId),
      purgeAllTrashedPrices(access.brandId),
      purgeAllTrashedContentActivities(access.brandId),
      purgeAllTrashedBanners(access.brandId),
    ]);

    // Portfolio must go before clients (client purge also hard-deletes linked works).
    const worksPurged = await purgeAllTrashedPortfolio(access.brandId);
    const clientsPurged = await purgeAllTrashedClients(access.brandId);

    // Folders purge contained files; remaining standalone files after.
    const foldersPurged = await purgeAllTrashedMediaFolders(mediaInput);
    const filesPurged = await purgeAllTrashedMediaLibraryFiles(mediaInput);

    const total =
      articlesPurged +
      pricesPurged +
      activitiesPurged +
      bannersPurged +
      worksPurged +
      clientsPurged +
      foldersPurged +
      filesPurged;

    if (total === 0) {
      return { success: false as const, error: "Trash is already empty." };
    }

    await recordActivityEvent({
      brandId: access.brandId,
      entityType: "client",
      entityId: "trash",
      action: "deleted",
      actor: access.user,
      entityTitle: "Emptied Trash",
      href: "/trash",
    });
    revalidateTrashPaths();
    return { success: true as const, purgedCount: total };
  } catch (error) {
    return toActionError(error, "Failed to empty Trash");
  }
}
