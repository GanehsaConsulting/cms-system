/** Shared query helpers for public read APIs. */

export function getSearchQuery(searchParams: URLSearchParams): string {
  return (searchParams.get("q") ?? searchParams.get("search") ?? "")
    .trim()
    .toLowerCase();
}

export function getBooleanFlag(
  searchParams: URLSearchParams,
  key: string,
): boolean | null {
  const raw = searchParams.get(key);
  if (raw === null) {
    return null;
  }
  if (raw === "true" || raw === "1") {
    return true;
  }
  if (raw === "false" || raw === "0") {
    return false;
  }
  return null;
}

export function matchesSearch(
  query: string,
  values: Array<string | null | undefined>,
): boolean {
  if (!query) {
    return true;
  }

  return values.some((value) => value?.toLowerCase().includes(query));
}

export function compareIsoDesc(left: string | null, right: string | null) {
  const leftTime = left ? new Date(left).getTime() : 0;
  const rightTime = right ? new Date(right).getTime() : 0;
  return rightTime - leftTime;
}

export function compareIsoAsc(left: string | null, right: string | null) {
  return -compareIsoDesc(left, right);
}

export function compareTextAsc(left: string, right: string) {
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}
