import {
  DEFAULT_WALLPAPER_ID,
  SYSTEM_WALLPAPER_DARK,
  SYSTEM_WALLPAPER_LIGHT,
  WALLPAPERS,
} from "@/config/wallpapers";
import {
  ACCENT_COOKIE_KEY,
  RESOLVED_DARK_COOKIE_KEY,
  THEME_COOKIE_KEY,
} from "@/lib/appearance/cookies";
import { WALLPAPER_PAINT_CACHE_KEY } from "@/lib/wallpaper/paint-cache";

const THEME_STORAGE_KEY = "cms:theme";
const ACCENT_STORAGE_KEY = "cms:accent";
const APP_ICON_STYLE_STORAGE_KEY = "cms:app-icon-style";
const WALLPAPER_STORAGE_KEY = "cms:wallpaper";
const WALLPAPER_MASK_STORAGE_KEY = "cms:wallpaper-mask";
const WALLPAPER_MASK_COLOR_STORAGE_KEY = "cms:wallpaper-mask-color";

function buildPresetWallpaperMapJson(): string {
  const map: Record<string, { kind: string; light: string; dark: string }> = {};

  for (const wallpaper of WALLPAPERS) {
    map[wallpaper.id] = {
      kind: wallpaper.kind,
      light: wallpaper.themeVariants?.light.background ?? wallpaper.background,
      dark: wallpaper.themeVariants?.dark.background ?? wallpaper.background,
    };
  }

  return JSON.stringify(map);
}

/**
 * Blocking bootstrap — runs before paint so theme + wallpaper match localStorage
 * and avoid a flash of defaults on refresh.
 */
export function createRootAppearanceBootstrapScript(): string {
  const presetMapJson = buildPresetWallpaperMapJson();

  return `
(function () {
  function readCookie(name) {
    var match = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\\\\]\\\\\\\\/+^])/g, "\\\\\\\\$1") + "=([^;]*)"),
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  var theme =
    readCookie("${THEME_COOKIE_KEY}") || readStorage("${THEME_STORAGE_KEY}") || "system";
  if (theme !== "light" && theme !== "dark" && theme !== "system") {
    theme = "system";
  }

  var accent =
    readCookie("${ACCENT_COOKIE_KEY}") || readStorage("${ACCENT_STORAGE_KEY}") || "blue";

  var appIcon = readStorage("${APP_ICON_STYLE_STORAGE_KEY}") || "colored";
  if (appIcon !== "colored" && appIcon !== "light" && appIcon !== "dark") {
    appIcon = "colored";
  }

  var dark = false;
  if (theme === "dark") {
    dark = true;
  } else if (theme === "light") {
    dark = false;
  } else {
    var resolvedDark = readCookie("${RESOLVED_DARK_COOKIE_KEY}");
    if (resolvedDark === "true") {
      dark = true;
    } else if (resolvedDark === "false") {
      dark = false;
    } else {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }

  var root = document.documentElement;
  root.dataset.accent = accent;
  root.dataset.appIcon = appIcon;
  root.classList.toggle("dark", dark);

  var wallpaperId = readStorage("${WALLPAPER_STORAGE_KEY}") || "${DEFAULT_WALLPAPER_ID}";
  root.dataset.wallpaper = wallpaperId;

  var presets = ${presetMapJson};
  var kind = "image";
  var background = dark
    ? "${SYSTEM_WALLPAPER_DARK}"
    : "${SYSTEM_WALLPAPER_LIGHT}";
  var maskOpacity = 0;
  var maskColor = "black";
  var hasPaint = false;

  try {
    var paintRaw = readStorage("${WALLPAPER_PAINT_CACHE_KEY}");
    if (paintRaw) {
      var paint = JSON.parse(paintRaw);
      if (paint && paint.kind && paint.backgroundLight && paint.backgroundDark) {
        kind = paint.kind;
        background = dark ? paint.backgroundDark : paint.backgroundLight;
        maskOpacity = typeof paint.maskOpacity === "number" ? paint.maskOpacity : 0;
        maskColor = paint.maskColor === "white" ? "white" : "black";
        if (paint.id) {
          root.dataset.wallpaper = paint.id;
        }
        hasPaint = true;
      }
    }
  } catch {}

  if (!hasPaint) {
    var preset = presets[wallpaperId];
    if (preset) {
      kind = preset.kind;
      background = dark ? preset.dark : preset.light;
    }

    var maskRaw = readStorage("${WALLPAPER_MASK_STORAGE_KEY}");
    if (maskRaw) {
      var parsedMask = parseInt(maskRaw, 10);
      if (!isNaN(parsedMask)) {
        maskOpacity = Math.min(100, Math.max(0, parsedMask));
      }
    }

    var storedMaskColor = readStorage("${WALLPAPER_MASK_COLOR_STORAGE_KEY}");
    if (storedMaskColor === "white" || storedMaskColor === "black") {
      maskColor = storedMaskColor;
    } else {
      maskColor = dark ? "black" : "white";
    }
  }

  var layer = document.getElementById("cms-wallpaper-boot-layer");
  var mask = document.getElementById("cms-wallpaper-boot-mask");
  if (!layer) {
    return;
  }

  layer.style.backgroundSize = "cover";
  layer.style.backgroundPosition = "center";
  layer.style.backgroundRepeat = "no-repeat";

  var gradientSuffix = ", var(--background)";

  if (kind === "solid") {
    layer.style.backgroundColor = background;
    layer.style.backgroundImage = "none";
  } else if (kind === "image") {
    layer.style.backgroundColor = "var(--background)";
    if (background.indexOf("url(") === 0) {
      layer.style.backgroundImage = background;
    } else {
      layer.style.backgroundImage = 'url("' + background + '")';
    }
  } else if (background === "var(--background)") {
    layer.style.backgroundColor = background;
    layer.style.backgroundImage = "none";
  } else if (
    background.length >= gradientSuffix.length &&
    background.slice(-gradientSuffix.length) === gradientSuffix
  ) {
    layer.style.backgroundColor = "var(--background)";
    layer.style.backgroundImage = background.slice(0, -gradientSuffix.length);
  } else {
    layer.style.backgroundColor = "var(--background)";
    layer.style.backgroundImage = background;
  }

  if (mask) {
    var showMask = kind !== "solid" && maskOpacity > 0;
    mask.style.opacity = showMask ? String(maskOpacity / 100) : "0";
    mask.style.backgroundColor =
      maskColor === "white" ? "rgb(255 255 255)" : "rgb(0 0 0)";
  }
})();
`.trim();
}
