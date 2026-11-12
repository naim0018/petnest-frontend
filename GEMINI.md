# PetNest Workspace Rulebook & Operating Standards

This rulebook is always active for the PetNest project. Follow these guidelines on every task without requiring repetitive user prompts.

---

## 1. Communication Style (Caveman Mode)

- **Tone & Conciseness**: Be terse, direct, and technically precise.
- **Drop Fluff**: No pleasantries ("Sure!", "Happy to help"), no hedging, no tool-call narration or pre-announcements.
- **Pattern**: `[Status/Problem]. [Action taken]. [Next step/Result].`
- **Preserve**: Keep code blocks, exact terminal commands, file paths, and error messages verbatim.

---

## 2. Engineering Philosophy (Ponytail / YAGNI Principle)

Think like a pragmatic senior engineer. The cleanest code is the code you never wrote.

### The 7-Rung Decision Ladder (Evaluate in order before writing code):
1. **Does this need to exist?** If no, skip it (YAGNI).
2. **Already in this codebase?** Reuse existing utilities, hooks, and components. Never re-implement what already exists.
3. **Can the standard library do it?** Use built-in JavaScript/TypeScript/Node.js capabilities.
4. **Is it a native platform feature?** Prefer native HTML5/CSS primitives over extra JavaScript libraries.
5. **Already-installed dependency?** Use packages already in `package.json`. Never install new packages without explicit user approval.
6. **Can it be written in one clean line?** Prefer readable, idiomatic expressions over multi-line boilerplate.
7. **Write minimum working code**: Deliver the simplest implementation that satisfies requirements with zero unnecessary abstractions or premature factories.

### Non-Negotiables:
- Never compromise security, input validation, role checks, or error handling for brevity.

---

## 3. PetNest UI Design System Standards

### Layout & Containers:
- **Wrapper**: Always wrap major layout containers in `<CommonWrapper className="...">` from `@/components/common/CommonWrapper`.
- **Responsive**: Mobile-first design (`sm:`, `md:`, `lg:`, `xl:`).
- **Dark Mode**: Every element must support dark mode. Pair light tokens with dark equivalents (e.g. `bg-card dark:bg-card/60`, `text-ink dark:text-white`).

### Design Tokens & Colors (Strict Token Rule):
- **Never use arbitrary bracket hex classes** (e.g. `bg-[#ff6b6b]`) when a PetNest theme token exists:
  - **Brand / Accent**: `coral`, `coral-dark`, `border-peach`.
  - **Surfaces**: `bg-card`, `bg-surface-soft`, `bg-surface-muted`, `bg-surface`.
  - **Text**: `text-ink` (primary), `text-ink-muted` (secondary), `text-ink-faint` (muted/placeholder).
  - **Borders**: `border-border-peach`, `border-border-subtle`.
- **Badge & Pill Elements**: Use `rounded-full` with subtle translucent backgrounds and matching borders.

### Typography:
- **Brand Headings & Hero Titles**: Always use `font-quicksand font-bold`.
- **Body & Controls**: Standard sans-serif (`font-sans`), clean line heights, readable tracking.

### Component Reuse:
- Check `@/components/common/` before building any UI element:
  - Buttons: `<PrimaryButton>`
  - Inputs: `<FormInput>`, `<FormSelect>`, `<PasswordInput>`
  - Brand: `<Logo>`, `<ThemeToggle>`

---

## 4. Architecture & Security Conventions

### Authentication & Cookies:
- **HttpOnly Cookies**: All auth tokens (`accessToken`, `refreshToken`) must be transported and managed strictly via secure `httpOnly` cookies.
- **No Token in API Payload**: Backend endpoints (`/auth/login`, `/auth/register`, `/auth/refresh-token`) must never return tokens in JSON bodies.
- **No Token in Redux Persist**: Never store tokens in Redux `authSlice` or `localStorage` (`persist:root`). Only persist non-sensitive user metadata (`userId`, `name`, `email`, `role`, `phone`).
- **RTK Query BaseApi**: Always keep `credentials: "include"` on fetch requests so cookies are automatically sent and received.

---

## 5. Skeleton Loading & UX Performance Standards

### Zero Center Spinners on Content Surfaces:
- **No Standalone Spinners**: NEVER use centered or full-page spinning loaders (`<Loader2 className="animate-spin" />`, `<div className="spinner">`) for main pages, catalog lists, data tables, or card grids.
- **Spinners Allowed Only In Buttons**: Loading spinners are strictly limited to inline indicators inside action buttons during active form submission/mutation (`isSubmitting`, `isPending`).

### Exact Layout Parity & Zero Layout Shift (CLS):
- **1:1 Geometric Reflection**: Every skeleton must duplicate the target component's exact geometry, dimensions, slot heights, paddings, flex layouts, and border-radii (`rounded-lg`, `rounded-full`).
- **Signature Silhouettes**: Preserve distinctive component branding elements in the skeleton (e.g., `PetCatalogCard`'s bottom double wave cut transition SVG) so layout and silhouettes never jump during hydration.
- **Fixed Slot Heights**: When target components enforce fixed slot heights (e.g., Slot 1 header, Slot 2 description `h-16`, Slot 4 status bar `h-9`), the skeleton must replicate these identical slot constraints.

### Skeleton Reusability & Structure:
- **Co-location & Naming**: Name skeletons after their target component: `[ComponentName]Skeleton.tsx`. Keep feature-specific skeletons co-located with their target components (e.g. `src/components/admin/pet-catalog/PetCatalogCardSkeleton.tsx`) and general layout skeletons in `@/components/common/Skeleton/`.
- **Card + Grid Exports**: Always export both the individual card skeleton (`[ComponentName]Skeleton`) and a configurable grid/list helper (`[ComponentName]GridSkeleton`) accepting `count`, `className`, and slot variant flags.

### Design Tokens & Dark Mode:
- **PetNest Tokens Only**: Use `bg-surface-muted`, `bg-tint-rose/40`, and `border-border-peach` tokens with `animate-pulse` or shimmer gradients. Never hardcode gray hex codes.
- **Full Theme Support**: Every skeleton element must look natural and balanced in both light and dark modes.

### Granular & Progressive Hydration:
- **Preserve Loaded Context**: If parent layout data (such as page title, breadcrumb, or stats banner) is already loaded, render those loaded elements immediately. Only skeletonize the specific child list or grid still awaiting data. Never unmount loaded surfaces to flash a generic loader.
