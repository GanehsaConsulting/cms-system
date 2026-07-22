# Design — CMS System

Locked design system for the company-profile CMS admin. Future Hallmark runs read this
file first; all CMS screens defer to it. Amend intentionally — the file is the rule.

Scope: **CMS admin UI only** (`app/(cms)/`, `components/cms/`, `components/shared/`).
Public marketing pages are out of scope unless explicitly requested.

## System
- Genre · modern-minimal (macOS System Settings register)
- Macrostructure · Workbench — sidebar shell + list/detail workspace
- Theme · custom (vibe: "frosted glass admin, Apple-native calm")
- Axes · light paper band / system sans display / single accent hue (user-selectable)

## Tokens (canonical · `app/globals.css` + `config/glass.ts`)

```css
:root {
  /* Canvas & surfaces */
  --background: #f2f2f7;
  --foreground: #1c1c1e;
  --card: #ffffff;
  --muted: #e5e5ea;
  --muted-foreground: #48484a;
  --border: rgb(60 60 67 / 0.18);

  /* Accent — default blue; user can switch via Appearance */
  --primary: #007aff;
  --primary-foreground: #ffffff;
  --ring: #007aff;

  /* Glass shell */
  --glass-fill-rgb: 248 248 248;
  --glass-fill-opacity: 0.65;
  --glass-fill: rgb(var(--glass-fill-rgb) / var(--glass-fill-opacity));
  --glass-backdrop-blur: 12px;
  --glass-shell-border: rgb(0 0 0 / 0.12);

  /* Radius hierarchy (config/shape.ts) */
  --radius-outer: 1.75rem;   /* L1 — page shell, sidebar */
  --radius-inner: 1rem;      /* L2 — cards, tables, panels */
  --radius-deep: 0.75rem;    /* L3 — nav items, compact controls */

  /* Typography — native stack, no webfont import */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  --font-heading: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.dark {
  --background: #000000;
  --foreground: #ffffff;
  --card: #1c1c1e;
  --glass-fill-rgb: 44 44 46;
}
```

Tailwind helpers: `config/glass.ts` (`GLASS_SURFACE`, `GLASS_SHELL_SURFACE`), `config/shape.ts`
(`RADIUS_OUTER`, `RADIUS_INNER`, `RADIUS_DEEP`), `config/spacing.ts` (`STACK_GAP` = `gap-3`).

## Layout voice
- **Shell** — fixed sidebar (glass outline) + scrollable main column on grouped canvas.
- **Page header** — title left; actions in `CmsPageHeaderActionsSlot`; subnav/tabs in
  `CmsPageHeaderSubnavSlot` (full width below title row).
- **List pages** — master table in glass card + optional detail panel (Articles, Clients,
  Activities pattern). Toolbar filters in header actions, not inside the table card.
- **Form pages** — grouped fields in glass sections; sticky save bar; locale tabs when i18n.
- **Bias** — left-aligned hierarchy; no centred hero blocks in admin UI.

## Component ownership (do not replace)
- shadcn/ui primitives in `components/ui/` — wrap, never edit.
- `GlassSurface`, `CmsList*`, `CmsPageHeader*`, `CmsFormFieldGroup` — reuse established patterns.
- Action feedback via `@/lib/notify/action-toast` (Sonner) on every mutation.
- Styling: Tailwind utilities first; no new component-level CSS blocks in `globals.css`.

## CTA voice
- Primary · solid `bg-primary` · `rounded-[var(--radius-deep)]` · compact padding
- Secondary · outline/ghost on glass · same radius
- Destructive · `destructive` token · confirm dialog for irreversible actions

## Motion stance
- Restrained — `animate-in` / opacity for panels; no decorative motion on data tables.
- Reduced-motion fallback · ≤150 ms opacity crossfade.

## Hallmark mode for this project
- **Polish in place** — tighten hierarchy, spacing, contrast, badges, empty states.
- **Do not** rotate catalog themes, macrostructures, or nav archetypes across CMS screens.
- **Do not** full redesign unless user explicitly asks for `hallmark redesign`.
- **Audit** (`hallmark audit <target>`) is diagnosis-only — no edits.
- Refuse AI-slop tells: purple-pink gradient heroes, Inter-as-display, centred-everything
  sections, icon-tile feature grids, fabricated stats/testimonials.

## Exports
Source of truth: `app/globals.css` CSS variables + `config/glass.ts` / `config/shape.ts`.
For shadcn/ui, tokens map via `@theme inline` in globals.css. Do not introduce parallel
token files unless the user asks to extend exports.
