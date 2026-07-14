export function extractImageSourcesFromHtml(html: string): string[] {
  if (!html.trim()) {
    return [];
  }

  const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  const sources = new Set<string>();

  for (const match of matches) {
    const source = match[1]?.trim();
    if (source) {
      sources.add(source);
    }
  }

  return Array.from(sources);
}
