/**
 * FE logo-wall / marquee filter — keep in sync with public site
 * `isCompanyLogoIcon()` (path usually includes `/company_logos/`).
 */
export function isCompanyLogoIcon(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  return (
    /\/company_logos\//i.test(trimmed) ||
    /ganesha_cms_clients\/company_logos/i.test(trimmed)
  );
}

export function hasClientLogo(url: string): boolean {
  return url.trim().length > 0;
}
