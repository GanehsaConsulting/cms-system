/**
 * Tracks when a native OS file picker is open so CMS dialogs can avoid
 * dismissing on focus-out / outside-press (which would unmount the input).
 */
let nativeFilePickerDepth = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function markNativeFilePickerOpen() {
  nativeFilePickerDepth += 1;
  emit();
}

export function markNativeFilePickerClosed() {
  nativeFilePickerDepth = Math.max(0, nativeFilePickerDepth - 1);
  emit();
}

export function isNativeFilePickerOpen() {
  return nativeFilePickerDepth > 0;
}

export function subscribeNativeFilePicker(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when a dialog close should be ignored while the OS file picker is up. */
export function shouldIgnoreDialogCloseForFilePicker(reason?: string) {
  if (!isNativeFilePickerOpen()) {
    return false;
  }

  return reason === "focus-out" || reason === "outside-press";
}
