export function createMediaAssetId(url: string): string {
  let hash = 0;

  for (let index = 0; index < url.length; index += 1) {
    hash = (hash << 5) - hash + url.charCodeAt(index);
    hash |= 0;
  }

  return `media-${Math.abs(hash).toString(36)}`;
}
