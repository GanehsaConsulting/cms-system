import type { MediaKind, MediaTypeFilter, MediaUsage } from "@/types/media";
import { MEDIA_LIBRARY_IN_USE_PAGE_SIZE } from "@/config/media-library";
import { paginateList } from "@/lib/list/pagination";

export function filterMediaAssetsByType<T extends { kind: MediaKind }>(
  assets: T[],
  typeFilter: MediaTypeFilter,
): T[] {
  if (typeFilter === "all") {
    return assets;
  }

  return assets.filter((asset) => asset.kind === typeFilter);
}

export function filterMediaAssetsBySearch<T extends { filename: string; url: string; usages: MediaUsage[] }>(
  assets: T[],
  query: string,
): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return assets;
  }

  return assets.filter((asset) => {
    const haystack = [
      asset.filename,
      asset.url,
      ...asset.usages.flatMap((usage) => [
        usage.entityTitle,
        usage.sourceLabel,
        usage.fieldPath,
        usage.caption ?? "",
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function paginateMediaAssets<T>(
  assets: T[],
  page: number,
  pageSize: number = MEDIA_LIBRARY_IN_USE_PAGE_SIZE,
) {
  return paginateList(assets, page, pageSize);
}

export function filterMediaLibraryFilesBySearch<
  T extends { filename: string; url: string; mimeType: string },
>(files: T[], query: string): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return files;
  }

  return files.filter((file) => {
    const haystack = [file.filename, file.url, file.mimeType]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function formatMediaKindLabel(kind: MediaKind): string {
  switch (kind) {
    case "image":
      return "Image";
    case "video":
      return "Video";
    case "document":
      return "Document";
    default:
      return "File";
  }
}

export function formatMediaFileSize(bytes: number): string {
  if (bytes <= 0) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatMediaUsageSummary(usages: MediaUsage[]): string {
  const primary = usages[0];
  if (!primary) {
    return "Unknown source";
  }

  if (usages.length === 1) {
    return `${primary.sourceLabel} · ${primary.entityTitle}`;
  }

  return `${primary.sourceLabel} · ${primary.entityTitle} · +${usages.length - 1} more`;
}

export function formatMediaUsageFieldLabel(fieldPath: string): string {
  if (fieldPath === "thumbnail") {
    return "Thumbnail";
  }

  if (fieldPath === "coverImage") {
    return "Cover image";
  }

  if (fieldPath === "logo") {
    return "Logo";
  }

  if (fieldPath === "avatarUrl") {
    return "Avatar";
  }

  if (fieldPath === "content") {
    return "Body content";
  }

  const galleryMatch = fieldPath.match(/^gallery\[(\d+)\]$/);
  if (galleryMatch) {
    return `Gallery image ${Number(galleryMatch[1]) + 1}`;
  }

  const bannerMatch = fieldPath.match(/^images\[(\d+)\]$/);
  if (bannerMatch) {
    return `Banner image ${Number(bannerMatch[1]) + 1}`;
  }

  const photoMatch = fieldPath.match(/^photos\./);
  if (photoMatch) {
    return "Client photo";
  }

  return fieldPath;
}

export function getMediaSourceHref(usage: MediaUsage): string | null {
  switch (usage.source) {
    case "article":
      return `/articles/${usage.entityId}/edit`;
    case "banner":
      return "/banners";
    case "client":
      return `/clients/${usage.entityId}/edit`;
    case "portfolio":
      return `/clients/portfolio/${usage.entityId}/edit`;
    case "brand":
      return "/settings";
    case "user":
      return "/settings/users";
    default:
      return null;
  }
}

export function countMediaAssetsByKind(assets: { kind: MediaKind }[]) {
  return assets.reduce(
    (counts, asset) => {
      counts[asset.kind] += 1;
      return counts;
    },
    {
      image: 0,
      video: 0,
      document: 0,
      other: 0,
    },
  );
}
