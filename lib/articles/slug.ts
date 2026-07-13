export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugifyArticleTitle(text: string, maxLength = 150): string {
  const slug = slugify(text);

  if (slug.length <= maxLength) {
    return slug;
  }

  return slug.slice(0, maxLength).replace(/-+$/, "");
}
