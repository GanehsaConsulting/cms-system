export type TrashKind =
  | "client"
  | "portfolio"
  | "article"
  | "price"
  | "activity"
  | "banner"
  | "media-file"
  | "media-folder";

export interface TrashListItem {
  kind: TrashKind;
  id: string;
  title: string;
  thumb: string | null;
  subtitle: string | null;
  deletedAt: string;
}

export interface TrashItemRef {
  kind: TrashKind;
  id: string;
}

/** Stable selection key — ids can collide across entity kinds. */
export function trashItemKey(item: TrashItemRef): string {
  return `${item.kind}:${item.id}`;
}

export function parseTrashItemKey(key: string): TrashItemRef | null {
  const sep = key.indexOf(":");
  if (sep <= 0) {
    return null;
  }
  return {
    kind: key.slice(0, sep) as TrashKind,
    id: key.slice(sep + 1),
  };
}
