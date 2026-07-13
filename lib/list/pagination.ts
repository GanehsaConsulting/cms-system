export function getVisiblePaginationPages(page: number, totalPages: number) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return pages.filter(
    (pageNumber) =>
      pageNumber === 1 ||
      pageNumber === totalPages ||
      Math.abs(pageNumber - page) <= 1,
  );
}

export function paginateList<T>(
  items: T[],
  page: number,
  pageSize: number,
) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize,
    total,
    totalPages,
    rangeStart: total === 0 ? 0 : start + 1,
    rangeEnd: Math.min(end, total),
  };
}
