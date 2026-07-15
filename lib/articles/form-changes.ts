import type { ArticleFormValues } from "@/lib/validations/article";

function arraysEqual(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

/** Section labels for unsaved-change notices in the article form. */
export function getArticleFormChangedSections(
  baseline: ArticleFormValues,
  current: ArticleFormValues,
): string[] {
  const sections: string[] = [];

  if (
    baseline.title !== current.title ||
    baseline.excerpt !== current.excerpt ||
    baseline.content !== current.content
  ) {
    sections.push("Article content");
  }

  if (
    baseline.thumbnail !== current.thumbnail ||
    !arraysEqual(baseline.gallery, current.gallery)
  ) {
    sections.push("Media");
  }

  if (
    baseline.status !== current.status ||
    baseline.scheduledAt !== current.scheduledAt ||
    baseline.highlighted !== current.highlighted ||
    baseline.category !== current.category ||
    baseline.authorName !== current.authorName ||
    !arraysEqual(baseline.tags, current.tags)
  ) {
    sections.push("Publication");
  }

  if (
    baseline.metaTitle !== current.metaTitle ||
    baseline.metaDescription !== current.metaDescription
  ) {
    sections.push("SEO");
  }

  return sections;
}
