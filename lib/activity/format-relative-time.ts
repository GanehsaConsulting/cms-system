/** Relative time copy for activity and notifications (en-US). */
export function formatActivityRelativeTime(
  isoDate: string,
  now: Date = new Date(),
): string {
  const created = new Date(isoDate).getTime();
  if (Number.isNaN(created)) {
    return "Unknown";
  }

  const deltaMs = Math.max(0, now.getTime() - created);
  const minutes = Math.floor(deltaMs / 60_000);

  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "Yesterday";
  }
  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}
