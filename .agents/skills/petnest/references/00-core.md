# 00 - Core Principles & Standards

- **Quality Standard**: All code must pass TypeScript type checks cleanly (`npx tsc --noEmit`) with 0 errors.
- **Import Alias**: Always use `@/` for absolute imports (e.g., `@/components/common/PrimaryButton`, `@/lib/utils`).
- **DRY & Single Source of Truth**: Eliminate duplicated UI logic or hardcoded style constants; rely on central design tokens (`global.css`) and shared common primitives (`@/components/common/`).
- **Mandatory Reusable Primitives**:
  - **Button**: ALWAYS use `PrimaryButton` (`@/components/common/PrimaryButton`) instead of raw `<button>` tags for action buttons.
  - **Layout Shell & Default Spacing**: ALWAYS wrap main page content in `CommonWrapper` (`@/components/common/CommonWrapper`). Use `max-w-[1800px]`, vertical padding `py-6`, and gap/spacing `gap-6` / `space-y-6` by default.
  - **Filters, Pagination & Avatars**: Use `CommonFilterComponent`, `Pagination`, `Avatar`, `UserProfile`, `Tooltip`, and `AnimatedContainer` from `@/components/common/`.
- **Strictly No Inline Styles**: Avoid React inline `style={{ ... }}` objects unless strictly required for dynamic pixel calculation. Use standard Tailwind utilities and CSS variables.
- **Curly's Law**: Each unit (function, class, component) must have one clear responsibility.
