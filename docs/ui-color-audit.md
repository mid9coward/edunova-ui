# UI Color Audit Guide

## Goal
- Use `src/app/styles/base.css` as the single source of truth for color tokens.
- Detect and prevent visual regressions caused by hardcoded colors or unsafe utility classes.
- Keep UI contrast and state styling consistent across public, protected, and admin pages.

## Source Of Truth
- Theme tokens are defined in `src/app/styles/base.css`.
- Supporting style layers:
  - `src/app/styles/components.css`
  - `src/app/styles/utilities.css`
  - `src/app/styles/animations.css`
  - `src/app/styles/tiptap.css`

## Color Contract

### Allowed semantic tokens
- `--background`
- `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--sidebar-*`
- `--chart-*`
- `--toast-*`

### Exception policy
- Hardcoded colors are accepted only when technically required:
  - Third-party appearance APIs (example: Stripe appearance config).
  - Rich text color picker palettes in editor tooling.
  - Brand illustration effects that are not semantic UI states.
- All exceptions must be documented in the static report with rationale.

## Legacy Utility Mapping
- `text-gray-*` -> `text-foreground` or `text-muted-foreground`
- `bg-white*` -> `bg-card` or `bg-background`
- `border-gray-*` -> `border-border`
- `from-blue-*`/`to-blue-*` -> `from-primary`/`to-primary`
- `from-purple-*`/`to-purple-*` -> `from-secondary`/`to-secondary`
- `from-cyan-*`/`to-cyan-*` -> `from-accent`/`to-accent`
- `text-red-*`/`bg-red-*`/`border-red-*` -> destructive token set

## Severity Model
- `P0`: Hardcoded color outside approved zones that can break readability or state affordance.
- `P1`: Non-token utility usage that is not immediately broken but increases theme drift risk.
- `P2`: Approved exception or source-of-truth style-layer usage.

## Audit Workflow

### 1) Static audit
- Run:
  - `npm run audit:color:static`
- Output:
  - `docs/reports/ui-color-audit-report.json`
  - `docs/reports/ui-color-audit-report.md`
- Notes:
  - Source-of-truth style files (`base.css`, `components.css`, `utilities.css`, `animations.css`, `tiptap.css`) are excluded from findings to keep the report actionable.
  - Approved exception paths are still tracked as `P2` with rationale.

### 2) Visual + contrast audit
- Use `tests/ui/color-routes-manifest.ts` as route matrix.
- One-time setup:
  - `npm install`
  - `npx playwright install chromium`
- Run:
  - `npm run audit:color:e2e:public` (public routes)
  - `npm run audit:color:e2e` (same as public unless auth flags provided)
  - `npm run audit:color:e2e:auth` (protected/admin routes; requires auth state)
- Environment:
  - `COLOR_AUDIT_BASE_URL=http://localhost:4000` (or deployed URL)
  - `COLOR_AUDIT_STORAGE_STATE=tests/ui/.auth/user.json` (required for auth routes)
  - `COLOR_AUDIT_INCLUDE_AUTH=1` (include routes with `requiresAuth: true`)
  - `COLOR_AUDIT_LEARNING_SLUG=<slug>` + `COLOR_AUDIT_LESSON_ID=<id>` (for learning route template)
- The spec captures screenshots per viewport and checks contrast heuristics.
- Artifacts are written to `tests/ui/.artifacts/color-regression/<timestamp>/`.

### 3) Manual QA states
- Verify default/hover/active/focus-visible/disabled/error/success/loading/selected.
- Stress test:
  - Long text, multiline labels, 125%-150% browser zoom, mobile landscape.
- Priority screens:
  - Header/footer/navigation
  - Form + modal + select/popover/tooltip
  - Toast/alert/badge
  - Learning coding screen
  - Tiptap content pages

## WCAG targets
- Normal text contrast: `>= 4.5:1`
- Large text or key icon contrast: `>= 3:1`

## Sign-off checklist
- No unresolved `P0` in report.
- All exceptions documented with reason.
- Contrast report reviewed for key pages.
- Manual state checklist completed on desktop and mobile breakpoints.
