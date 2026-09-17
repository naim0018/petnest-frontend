# 02 - Project & Feature Folder Structure

- **Colocated Feature Directories**: Colocate domain-specific components, hooks, and types inside private subfolders inside the feature directory:
  ```
  src/app/(public)/feed/
  ├── _components/      # Feature-specific subcomponents
  ├── _hooks/           # Feature-specific custom hooks
  ├── _types/           # Feature TypeScript interfaces
  ├── _utils/           # Feature helpers
  ├── [id]/
  │   └── page.tsx
  ├── loading.tsx
  ├── error.tsx
  └── page.tsx
  ```
- **Global Shared Primitives**: Move components to `src/components/ui/` or `src/components/common/` ONLY when multiple distinct features actually consume them.
