# 03 - Design System & Color Tokens

- **No Arbitrary Bracket Values**: Do NOT use arbitrary bracket values for dimensions and radii (`w-10 h-10` / `size-10` instead of `w-[40px] h-[40px]`, `rounded-xl` instead of `rounded-[12px]`).
- **Strictly Tokenized Colors (`global.css`)**: Never hardcode hex values (`#ff6b6b`, `#fff0f0`) or arbitrary Tailwind slate/rose colors (`bg-slate-*`, `text-slate-*`).
  - **Brand Coral**: `bg-coral`, `text-coral`, `border-coral`, `stroke-coral`, `shadow-coral/40`
  - **Brand Soft Light**: `bg-coral-light` (maps to `#fff0f0` in light mode, `#321d21` in dark mode)
  - **Cards & Surfaces**: `bg-card`, `bg-popover`, `bg-background`
  - **Muted Surfaces**: `bg-surface-muted`, `bg-surface-soft`
  - **Borders**: `border-border-peach`, `border-border`
  - **Text Scale**: `text-ink` (primary), `text-ink-muted` (subtext/labels), `text-ink-faint` (placeholders/time)

- **Border Radii Rules**:
  - **Containers & Cards (Max `rounded-xl`)**: All cards, headers, panels, modals, popovers, and layout containers must use at most `rounded-xl` (or `rounded-lg` / `rounded-md`). **NEVER use `rounded-2xl` or `rounded-3xl` for containers!**
  - **Buttons & Chips**: Interactive buttons and chips can be `rounded-md`, `rounded-lg`, `rounded-xl`, or `rounded-full` (for full pill buttons / circular FABs).
  - **Avatars**: `rounded-full` for circular user/pet photos.

- **Typography Scale**: Quicksand font applies globally (`font-sans`). Headings: `text-2xl` / `text-3xl font-bold font-quicksand`. Body: `text-sm` / `text-base text-ink`.
