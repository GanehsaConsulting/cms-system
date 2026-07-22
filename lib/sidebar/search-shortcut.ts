/** True when running in the browser on Apple platforms. */
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

/** Label for the sidebar search shortcut (⌘/ on Mac, Ctrl+/ elsewhere). */
export function getSidebarSearchShortcutLabel(): string {
  return isApplePlatform() ? "⌘/" : "Ctrl+/";
}

/** True for Cmd+/ (Mac) or Ctrl+/ (Windows/Linux). */
export function isSidebarSearchShortcut(event: KeyboardEvent): boolean {
  if (!(event.metaKey || event.ctrlKey)) {
    return false;
  }

  return event.key === "/" || event.code === "Slash";
}
