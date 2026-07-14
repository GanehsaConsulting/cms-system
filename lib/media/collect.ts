import { MEDIA_SOURCE_LABELS } from "@/config/media-library";
import { getBannerImages } from "@/lib/banners/images";
import { classifyMediaUrl } from "@/lib/media/classify";
import { extractImageSourcesFromHtml } from "@/lib/media/html-images";
import { createMediaAssetId } from "@/lib/media/ids";
import type {
  MediaAsset,
  MediaLibrarySnapshot,
  MediaUsage,
} from "@/types/media";

interface PendingMediaReference {
  url: string;
  usage: MediaUsage;
}

function pushReference(
  references: PendingMediaReference[],
  url: string,
  usage: Omit<MediaUsage, "sourceLabel"> & { source: MediaUsage["source"] },
) {
  const trimmed = url.trim();
  if (!trimmed) {
    return;
  }

  references.push({
    url: trimmed,
    usage: {
      ...usage,
      sourceLabel: MEDIA_SOURCE_LABELS[usage.source],
    },
  });
}

function collectArticleMedia(snapshot: MediaLibrarySnapshot): PendingMediaReference[] {
  const references: PendingMediaReference[] = [];

  for (const article of snapshot.articles) {
    pushReference(references, article.thumbnail, {
      source: "article",
      entityId: article.id,
      entityTitle: article.title,
      fieldPath: "thumbnail",
      updatedAt: article.updatedAt,
    });

    for (const [index, imageUrl] of article.gallery.entries()) {
      pushReference(references, imageUrl, {
        source: "article",
        entityId: article.id,
        entityTitle: article.title,
        fieldPath: `gallery[${index}]`,
        updatedAt: article.updatedAt,
      });
    }

    for (const imageUrl of extractImageSourcesFromHtml(article.content)) {
      pushReference(references, imageUrl, {
        source: "article",
        entityId: article.id,
        entityTitle: article.title,
        fieldPath: "content",
        updatedAt: article.updatedAt,
      });
    }
  }

  return references;
}

function collectBannerMedia(snapshot: MediaLibrarySnapshot): PendingMediaReference[] {
  const references: PendingMediaReference[] = [];

  for (const banner of snapshot.banners) {
    for (const [index, imageUrl] of getBannerImages(banner).entries()) {
      pushReference(references, imageUrl, {
        source: "banner",
        entityId: banner.id,
        entityTitle: banner.key,
        fieldPath: `images[${index}]`,
        updatedAt: banner.updatedAt,
      });
    }
  }

  return references;
}

function collectClientMedia(snapshot: MediaLibrarySnapshot): PendingMediaReference[] {
  const references: PendingMediaReference[] = [];

  for (const client of snapshot.clients) {
    pushReference(references, client.logo, {
      source: "client",
      entityId: client.id,
      entityTitle: client.name,
      fieldPath: "logo",
      updatedAt: client.updatedAt,
    });

    for (const photo of client.photos) {
      pushReference(references, photo.url, {
        source: "client",
        entityId: client.id,
        entityTitle: client.name,
        fieldPath: `photos.${photo.id}`,
        caption: photo.caption,
        updatedAt: client.updatedAt,
      });
    }
  }

  return references;
}

function collectPortfolioMedia(
  snapshot: MediaLibrarySnapshot,
): PendingMediaReference[] {
  const references: PendingMediaReference[] = [];

  for (const work of snapshot.portfolio) {
    pushReference(references, work.coverImage, {
      source: "portfolio",
      entityId: work.id,
      entityTitle: work.title,
      fieldPath: "coverImage",
      updatedAt: work.updatedAt,
    });
  }

  return references;
}

function collectBrandMedia(snapshot: MediaLibrarySnapshot): PendingMediaReference[] {
  const references: PendingMediaReference[] = [];

  for (const brand of snapshot.brands) {
    pushReference(references, brand.logo, {
      source: "brand",
      entityId: brand.id,
      entityTitle: brand.name,
      fieldPath: "logo",
      updatedAt: brand.updatedAt,
    });
  }

  return references;
}

function collectUserMedia(snapshot: MediaLibrarySnapshot): PendingMediaReference[] {
  const references: PendingMediaReference[] = [];

  for (const user of snapshot.users) {
    pushReference(references, user.avatarUrl, {
      source: "user",
      entityId: user.id,
      entityTitle: user.name,
      fieldPath: "avatarUrl",
      updatedAt: user.updatedAt,
    });
  }

  return references;
}

export function collectMediaLibrary(snapshot: MediaLibrarySnapshot): MediaAsset[] {
  const references = [
    ...collectArticleMedia(snapshot),
    ...collectBannerMedia(snapshot),
    ...collectClientMedia(snapshot),
    ...collectPortfolioMedia(snapshot),
    ...collectBrandMedia(snapshot),
    ...collectUserMedia(snapshot),
  ];

  const assetMap = new Map<string, MediaAsset>();

  for (const reference of references) {
    const classified = classifyMediaUrl(reference.url);
    const id = createMediaAssetId(reference.url);
    const existing = assetMap.get(id);

    if (existing) {
      existing.usages.push(reference.usage);
      if (
        new Date(reference.usage.updatedAt).getTime() >
        new Date(existing.updatedAt).getTime()
      ) {
        existing.updatedAt = reference.usage.updatedAt;
      }
      continue;
    }

    assetMap.set(id, {
      id,
      url: reference.url,
      kind: classified.kind,
      mimeType: classified.mimeType,
      filename: classified.filename,
      usages: [reference.usage],
      updatedAt: reference.usage.updatedAt,
    });
  }

  return Array.from(assetMap.values()).sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}
