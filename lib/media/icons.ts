import type { MediaTypeFilter } from "@/types/media";
import type { MediaKind } from "@/types/media";
import type { Icon } from "@/lib/icons";
import {
  DocumentIcon,
  FileTextIcon,
  FolderOpenIcon,
  PhotoIcon,
  PlayRectangleIcon,
} from "@/lib/icons";

export const MEDIA_KIND_ICONS: Record<MediaKind, Icon> = {
  image: PhotoIcon,
  video: PlayRectangleIcon,
  document: DocumentIcon,
  other: FileTextIcon,
};

export const MEDIA_TYPE_FILTER_ICONS: Record<MediaTypeFilter, Icon> = {
  all: FolderOpenIcon,
  image: PhotoIcon,
  video: PlayRectangleIcon,
  document: DocumentIcon,
  other: FileTextIcon,
};

export function getMediaKindIcon(kind: MediaKind): Icon {
  return MEDIA_KIND_ICONS[kind];
}

export function getMediaTypeFilterIcon(filter: MediaTypeFilter): Icon {
  return MEDIA_TYPE_FILTER_ICONS[filter];
}
