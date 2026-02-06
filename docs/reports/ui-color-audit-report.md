# UI Color Audit Report

Generated at: `2026-02-06T15:21:52.419Z`

## Summary

- Total findings: **6**
- Actionable findings (P0 + P1): **0**
- Approved exceptions (P2): **6**
- P0: **0**
- P1: **0**
- P2: **6**
- Total files discovered: **407**
- Source-of-truth files skipped from scan: **5**
- Analyzed files: **402**

## Top files by finding count

- `src/lib/config/stripe.ts`: 4
- `src/components/tiptap/toolbar.tsx`: 2

## Findings

- [P2] `src/components/tiptap/toolbar.tsx:356` - `#ffff00`
  - Kind: hardColor
  - Suggestion: Replace hardcoded value with semantic token (e.g. var(--primary), var(--foreground), var(--border)).
- [P2] `src/components/tiptap/toolbar.tsx:398` - `#f8f8f2`
  - Kind: hardColor
  - Suggestion: Replace hardcoded value with semantic token (e.g. var(--primary), var(--foreground), var(--border)).
- [P2] `src/lib/config/stripe.ts:8` - `hsl(var(--primary)`
  - Kind: hardColor
  - Suggestion: Replace hardcoded value with semantic token (e.g. var(--primary), var(--foreground), var(--border)).
- [P2] `src/lib/config/stripe.ts:9` - `hsl(var(--background)`
  - Kind: hardColor
  - Suggestion: Replace hardcoded value with semantic token (e.g. var(--primary), var(--foreground), var(--border)).
- [P2] `src/lib/config/stripe.ts:10` - `hsl(var(--foreground)`
  - Kind: hardColor
  - Suggestion: Replace hardcoded value with semantic token (e.g. var(--primary), var(--foreground), var(--border)).
- [P2] `src/lib/config/stripe.ts:11` - `hsl(var(--destructive)`
  - Kind: hardColor
  - Suggestion: Replace hardcoded value with semantic token (e.g. var(--primary), var(--foreground), var(--border)).

## Approved exceptions

- `src/lib/config/stripe.ts`: Third-party Stripe appearance configuration.
- `src/components/tiptap/toolbar.tsx`: Rich text color picker defaults and authoring palette.
- `src/components/tiptap/mention-node-view.tsx`: Editor node rendering style boundary.

## Source-of-truth style layers (excluded from findings)

- `src/app/styles/base.css`: Theme tokens and core palette source-of-truth.
- `src/app/styles/components.css`: Shared component style layer with approved visual effects.
- `src/app/styles/utilities.css`: Legacy utility compatibility layer intentionally centralizes mappings.
- `src/app/styles/animations.css`: Animation effects and gradients intentionally authored at style-layer.
- `src/app/styles/tiptap.css`: Editor-specific styling layer.
