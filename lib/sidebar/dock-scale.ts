import {
  SIDEBAR_DOCK_INFLUENCE,
  SIDEBAR_DOCK_MAX_SCALE,
} from "@/config/sidebar";

/** Apple-style dock magnification curve. */
export function getDockScale(
  mouseY: number | null,
  itemCenterY: number,
  influence = SIDEBAR_DOCK_INFLUENCE,
  maxScale = SIDEBAR_DOCK_MAX_SCALE,
): number {
  if (mouseY === null) {
    return 1;
  }

  const distance = Math.abs(mouseY - itemCenterY);

  if (distance >= influence) {
    return 1;
  }

  const t = 1 - distance / influence;
  const eased = 0.5 - 0.5 * Math.cos(Math.PI * t);

  return 1 + (maxScale - 1) * eased;
}
