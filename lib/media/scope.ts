import type { MediaLibraryScope } from "@/types/media";

export const MEDIA_LIBRARY_SCOPES: MediaLibraryScope[] = [
  "shared",
  "brand",
  "personal",
];

export function isMediaLibraryScope(value: string): value is MediaLibraryScope {
  return MEDIA_LIBRARY_SCOPES.includes(value as MediaLibraryScope);
}

export interface MediaScopeContext {
  scope: MediaLibraryScope;
  brandId: string | null;
  ownerUserId: string | null;
}

export function buildMediaScopeContext(input: {
  scope: MediaLibraryScope;
  brandId?: string | null;
  ownerUserId?: string | null;
}): MediaScopeContext {
  if (input.scope === "shared") {
    return { scope: "shared", brandId: null, ownerUserId: null };
  }

  if (input.scope === "brand") {
    const brandId = input.brandId?.trim() || null;
    if (!brandId) {
      throw new Error("Active brand is required for brand media.");
    }
    return { scope: "brand", brandId, ownerUserId: null };
  }

  const ownerUserId = input.ownerUserId?.trim() || null;
  if (!ownerUserId) {
    throw new Error("Signed-in user is required for personal media.");
  }
  return { scope: "personal", brandId: null, ownerUserId };
}

export function mediaScopeMatches(
  item: MediaScopeContext,
  context: MediaScopeContext,
): boolean {
  if (item.scope !== context.scope) {
    return false;
  }

  if (context.scope === "brand") {
    return item.brandId === context.brandId;
  }

  if (context.scope === "personal") {
    return item.ownerUserId === context.ownerUserId;
  }

  return true;
}

export function assertCanAccessMediaScope(
  item: MediaScopeContext,
  actor: { id: string },
  activeBrandId: string | null,
): void {
  if (item.scope === "shared") {
    return;
  }

  if (item.scope === "brand") {
    if (!item.brandId || item.brandId !== activeBrandId) {
      throw new Error("You cannot access this brand media.");
    }
    return;
  }

  if (item.ownerUserId !== actor.id) {
    throw new Error("You cannot access this personal media.");
  }
}
