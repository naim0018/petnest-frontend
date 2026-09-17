# 01 - Architecture & Next.js Conventions

- **Server Components by Default**: All page routes and structural layouts must be React Server Components (RSC).
- **Client Component Leaf Boundaries**: Add `"use client";` ONLY at the top of small interactive leaf components (e.g., `<LikeButton />`, `<AddToCartButton />`). Never convert an entire page to a Client Component for one button's state.
- **Store & RTK Query Colocation**: Place API endpoints and types in feature folders under `src/store/Api/`:
  ```
  src/store/Api/Shelter/
  ├── shelter.api.ts
  └── shelter.type.ts
  ```
- **Error & Loading Boundaries**: Place `error.tsx` and `loading.tsx` at meaningful feature/route boundaries where isolated recovery or unique skeleton UX is valuable. Do not create them mechanically for every page when parent boundaries provide the correct experience. Refer to [`references/08-loading-and-skeletons.md`](file:///d:/Projects/PetNest/petnest-frontend/.agents/skills/petnest/references/08-loading-and-skeletons.md).
