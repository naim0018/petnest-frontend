# 08 - Loading & Error Boundaries Standards

## 1. Loading Boundaries (`loading.tsx`)
- **Root-Level Fallback**: Provide a root-level loading/error fallback where appropriate.
- **Selective Route-Level Loading**: Add route-level `loading.tsx` ONLY when the route requires a skeleton that meaningfully differs from its parent loading state.
- **Closest Segment Ownership**: Place `loading.tsx` at the closest route segment that owns the loading UX.
- **Avoid Duplication**: Do NOT create duplicate `loading.tsx` files mechanically for every sub-route when a parent loading boundary already provides the correct loading experience.

## 2. Error Boundaries (`error.tsx` & `global-error.tsx`)
- **Meaningful Boundaries**: Add `error.tsx` at meaningful feature/route boundaries where isolated recovery is valuable.
- **No Mechanical Duplication**: Do NOT create `error.tsx` mechanically for every single page. Prefer the nearest meaningful error boundary rather than duplicated error UI.
- **Global Error Handling**: Use `global-error.tsx` at the root (`src/app/global-error.tsx`) to catch unhandled root layout runtime errors.

## 3. Skeleton Quality & Layout Stability
- **Identical Layout Skeletons**: Skeletons MUST preserve the exact dimensions, spacing, grid, height, padding, and visual structure of the final content to minimize layout shift.
- **Skeleton Utility & Tokens**: Use `animate-pulse` with design system tokens (`bg-surface-muted`, `border-border-peach`).
