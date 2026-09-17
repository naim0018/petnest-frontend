# 04 - Component Patterns & Reusable Primitives

## Core Rule: Reuse Primitives First
Before building any UI element, check `@/components/common/` for existing primitives. Do not duplicate button, filter, avatar, wrapper, or pagination logic.

## 1. Container Alignment & Spacing Standard (`CommonWrapper`)
- **Container Alignment & Max Width**: Main page content MUST use `CommonWrapper` (`@/components/common/CommonWrapper`), which defaults to `w-full max-w-[1800px] mx-auto px-4 xl:px-15 py-6`.
- **Default Padding & Spacing Standard**: Standardize vertical padding to `py-6` and section gaps to `gap-6` / `space-y-6` by default across layouts, cards, and grids unless explicitly required otherwise.

## 2. Button Standard (`PrimaryButton`)
- **Always use `PrimaryButton`**: Never build raw `<button className="...">` tags for action buttons. Rely on `PrimaryButton` (`@/components/common/PrimaryButton`).
- **Supported Variants**: `variant="primary" | "secondary" | "outline" | "coralLight" | "ghost" | "danger" | "success"`
- **Supported Sizes**: `size="sm" | "md" | "lg" | "icon"`
- **Built-in Props**: `isLoading`, `leftIcon`, `rightIcon`, `fullWidth`, `disabled`

## 3. Strict Rule: Zero Inline Styles
- **No `style={{ ... }}` Props**: Avoid React inline `style={{ ... }}` objects. Use Tailwind classes, CSS variables, and design tokens (`global.css`).
- **Exceptions**: Only permissible for dynamic runtime values calculated in JS (e.g. dynamic canvas coordinates or real-time drag offsets).

## 4. Shared Common Component Catalog (`@/components/common/`)

| Component | Path | Description & Usage |
| :--- | :--- | :--- |
| `CommonWrapper` | `@/components/common/CommonWrapper` | Standard page alignment wrapper (`max-w-[1800px] mx-auto px-4 xl:px-15 py-6`). |
| `PrimaryButton` | `@/components/common/PrimaryButton` | Standardized button primitive with variants, loading state, and icons. |
| `CommonFilterComponent` | `@/components/common/CommonFilterComponent` | Responsive filter bar combining date picker and select dropdowns. |
| `FilterSelect` | `@/components/common/FilterSelect` | Popover dropdown filter with icon, title, options, and active state. |
| `FilterDatePicker` | `@/components/common/FilterDatePicker` | Date range selector popover with prev/next quick navigation. |
| `Pagination` | `@/components/common/Pagination` | Full pagination bar displaying `Showing X-Y of Z`, page numbers, and prev/next. |
| `Avatar` | `@/components/common/Avatar` | User photo/initials with ring styles (`gradient`, `solid`, `seen`), badges (`online`, `offline`, `plus`), and size scaling (`xs` to `2xl`). |
| `AvatarStack` | `@/components/common/Avatar` | Overlapping avatar group with overflow tooltip indicator (`+3`). |
| `UserProfile` | `@/components/common/UserProfile` | Header user avatar trigger and dropdown navigation menu. |
| `Tooltip` | `@/components/common/Tooltip` | Directional tooltip popup wrapper (`top`, `bottom`, `left`, `right`). |
| `AnimatedContainer` | `@/components/common/AnimatedContainer` | Framer Motion scroll/entrance animation wrapper (`up`, `down`, `left`, `right`, `none`). |

## 5. Composition & Architecture Patterns
- **Composition Over Boolean Overload**: Pass `children` and layout slots rather than passing dozens of conditional boolean flags.
- **Compound Components**: Use for related families (`<Card><CardHeader /><CardContent /><CardFooter /></Card>`, `<Modal><Modal.Trigger /><Modal.Content /></Modal>`).
- **Clean Component API**: Always export TypeScript prop interfaces, accept `className` for overrides via `cn()`, and provide sensible default props.
