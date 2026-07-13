export function isArticleListTabActive(pathname: string) {
  if (pathname === "/articles") {
    return true;
  }

  return /^\/articles\/[^/]+\/edit$/.test(pathname);
}

export function isArticleSectionActive(pathname: string) {
  return pathname.startsWith("/articles");
}
