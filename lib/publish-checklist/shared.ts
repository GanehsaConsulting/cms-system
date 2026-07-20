export interface PublishChecklistItem {
  id: string;
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

export function getScoreStatusLabel(score: number): string {
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

export function buildPublishChecklistResult(
  items: PublishChecklistItem[],
): PublishChecklistResult {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = items
    .filter((item) => item.completed)
    .reduce((sum, item) => sum + item.weight, 0);
  const score =
    totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
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
