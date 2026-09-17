# 05 - Forms, Validation & Reusable Data Components

- **Schema Validation (Zod + React Hook Form)**: All interactive forms must use Zod schemas (`z.object({...})`) paired with `react-hook-form`.
- **Field Wrappers**: Inputs must render structured field wrappers (`FormField` / `Label` / `ErrorMessage`) with inline accessible error labels.
- **Reusable Data Primitives (`src/components/common/`)**: Always reuse existing shared data primitives:
  - `DynamicForm` (`@/components/common/DynamicForm`): For data-driven forms & multi-step schemas.
  - `DynamicTable` (`@/components/common/DynamicTable`): For data grids, tables, and column sorting.
  - `CommonFilterComponent`, `FilterSelect`, `FilterDatePicker`: For multi-field filter bars.
  - `Pagination` (`@/components/common/Pagination`): For table pagination.
