import type { ArticleFormValues } from "@/lib/validations/article";

export type PublishChecklistItemId =
  | "title"
  | "content"
  | "excerpt"
  | "category"
  | "author"
  | "tags"
  | "metaTitle"
  | "metaDescription";

export interface PublishChecklistItem {
  id: PublishChecklistItemId;
  label: string;
  hint: string;
  completed: boolean;
  required: boolean;
  weight: number;
}

export interface PublishChecklistResult {
  items: PublishChecklistItem[];
  score: number;
  completedCount: number;
  totalCount: number;
  requiredComplete: boolean;
  statusLabel: string;
}

export type PublishChecklistValues = Pick<
  ArticleFormValues,
  | "title"
  | "excerpt"
  | "content"
  | "category"
  | "authorName"
  | "tags"
  | "metaTitle"
  | "metaDescription"
>;

function hasArticleContent(content: string): boolean {
  return (
    content !== "<p></p>" &&
    content.replace(/<[^>]*>/g, "").trim().length > 0
  );
}

function getScoreStatusLabel(score: number): string {
  if (score >= 100) {
    return "Excellent";
  }

  if (score >= 80) {
    return "Good to go";
  }

  if (score >= 50) {
    return "Almost there";
  }

  return "Needs work";
}

export function getArticlePublishChecklist(
  values: PublishChecklistValues,
): PublishChecklistResult {
  const items: PublishChecklistItem[] = [
    {
      id: "title",
      label: "Title",
      hint: "At least 3 characters",
      completed: values.title.trim().length >= 3,
      required: true,
      weight: 20,
    },
    {
      id: "content",
      label: "Article content",
      hint: "Write the main body",
      completed: hasArticleContent(values.content),
      required: true,
      weight: 25,
    },
    {
      id: "excerpt",
      label: "Excerpt",
      hint: "Short summary for article cards",
      completed: values.excerpt.trim().length > 0,
      required: false,
      weight: 15,
    },
    {
      id: "category",
      label: "Category",
      hint: "Assign a category",
      completed: Boolean(values.category),
      required: true,
      weight: 5,
    },
    {
      id: "author",
      label: "Author",
      hint: "Select an author",
      completed: Boolean(values.authorName),
      required: true,
      weight: 5,
    },
    {
      id: "tags",
      label: "Tags",
      hint: "Add at least one tag",
      completed: values.tags.length > 0,
      required: false,
      weight: 10,
    },
    {
      id: "metaTitle",
      label: "Meta title",
      hint: "SEO title for search engines",
      completed: values.metaTitle.trim().length > 0,
      required: false,
      weight: 10,
    },
    {
      id: "metaDescription",
      label: "Meta description",
      hint: "SEO description for search engines",
      completed: values.metaDescription.trim().length > 0,
      required: false,
      weight: 10,
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = items
    .filter((item) => item.completed)
    .reduce((sum, item) => sum + item.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);
  const completedCount = items.filter((item) => item.completed).length;
  const requiredComplete = items
    .filter((item) => item.required)
    .every((item) => item.completed);

  return {
    items,
    score,
    completedCount,
    totalCount: items.length,
    requiredComplete,
    statusLabel: getScoreStatusLabel(score),
  };
}
