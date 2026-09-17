# 07 - Accessibility (a11y) & Keyboard Navigation

- **Explicit Aria Labels**: All icon-only buttons (`<button aria-label="...">`) must have explicit, descriptive `aria-label` strings.
- **Keyboard Navigation & Escape Key**: All modals, popovers, dropdowns, and drawer panels must:
  - Close when pressing the `Escape` key.
  - Be navigable via `Tab` key without focus traps.
  - Support `Enter` / `Space` activation on interactive controls.
- **Semantic Media Alt Text**: Images (`next/image`) must always include descriptive, non-generic `alt` text.
