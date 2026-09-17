# Next.js Reusable Components Guide 🚀

This guide explains how to use the premium, reusable components included in this template. All components are located in `src/components/common/` and are fully typed.

---

## 1. Dynamic Table (`DynamicTable`)
The `DynamicTable` is a powerful component for rendering sortable, searchable, filterable, and paginated data tables with CSV export support.

### Import
```typescript
import DynamicTable, { Column } from "@/components/common/DynamicTable/DynamicTable";
```

### Basic Example
```tsx
import React from "react";
import DynamicTable, { Column } from "@/components/common/DynamicTable/DynamicTable";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserTable() {
  const columns: Column<User>[] = [
    { header: "Name", accessorKey: "name", sortable: true },
    { header: "Email", accessorKey: "email", sortable: true },
    { header: "Role", accessorKey: "role", sortable: true },
  ];

  const data: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "User" },
  ];

  return (
    <DynamicTable
      title="Users List"
      columns={columns}
      data={data}
      searchPlaceholder="Search users..."
      enableExport={true}
    />
  );
}
```

---

## 2. Dynamic Form (`CommonForm`)
`CommonForm` is a schema-driven form component powered by `react-hook-form` and `zod`. It automatically generates fields based on configuration schemas.

### Import
```typescript
import CommonForm from "@/components/common/DynamicForm/CommonForm";
import type { FieldConfig } from "@/components/common/DynamicForm/FormFields/FieldTypes";
```

### Basic Example
```tsx
import React from "react";
import { z } from "zod";
import CommonForm from "@/components/common/DynamicForm/CommonForm";
import type { FieldConfig } from "@/components/common/DynamicForm/FormFields/FieldTypes";

const schema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export default function ProfileForm() {
  const fields: FieldConfig[] = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
    },
  ];

  const handleSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  return (
    <CommonForm
      schema={schema}
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Save Profile"
    />
  );
}
```

---

## 3. Other Utility Components

### `Avatar` & `AvatarStack`
A highly scalable, design-system compliant Avatar component supporting brand gradient rings, status/action badges (plus button, online dot), titles, title icons, and overlapping avatar stacks.

```tsx
import { Avatar, AvatarStack } from "@/components/common/Avatar";
import { Dog } from "lucide-react";

// 1. Clean Standard Avatar
<Avatar name="Sarah" src="/user.jpg" size="lg" />

// 2. Story Avatar with Plus Badge & Title ("Your Story")
<Avatar
  name="Sarah"
  src="/user.jpg"
  size="xl"
  ring="solid"
  badge="plus"
  title="Your Story"
  onBadgeClick={() => console.log("Add Story")}
/>

// 3. Active Story Avatar with Brand Gradient Ring & Title + Icon ("Luna 🐶")
<Avatar
  name="Luna"
  src="/dog.jpg"
  size="xl"
  ring="gradient"
  title="Luna"
  titleIcon={<Dog className="h-4 w-4 text-foreground" />}
/>

// 4. Active Story Avatar with Gradient Ring & Online Dot ("Rafi & Bella")
<Avatar
  name="Rafi & Bella"
  src="/cat-user.jpg"
  size="lg"
  ring="gradient"
  badge="online"
  title="Rafi & Bella"
/>

// 5. Avatar Stack
const users = [{ name: "Alice" }, { name: "Bob", src: "/bob.jpg" }];
<AvatarStack users={users} limit={2} size="md" />
```

### `Tooltip`
Renders a lightweight client-side hover tooltip.
```tsx
import { Tooltip } from "@/components/common/Tooltip";

<Tooltip content="Helper text explanation">
  <button>Hover me</button>
</Tooltip>
```

### `ThemeToggle`
Standard dark/light mode toggle integrated with `next-themes`.
```tsx
import { ThemeToggle } from "@/components/common/ThemeToggle";

<ThemeToggle />
```

### `AnimatedContainer`
Framer motion wrapper to trigger enter/scroll animations.
```tsx
import AnimatedContainer from "@/components/common/AnimatedContainer";

<AnimatedContainer direction="up" delay={0.2}>
  <div>Will animate in on scroll</div>
</AnimatedContainer>
```

### `CommonSelect`
A flexible, popover-based reusable select dropdown component supporting optional search, clear button, custom icons, labels, sizes, and error states.
```tsx
import CommonSelect from "@/components/common/CommonSelect";

<CommonSelect
  label="Pet Category"
  placeholder="Choose a category..."
  options={[
    { label: "Dogs", value: "dogs" },
    { label: "Cats", value: "cats" },
    { label: "Birds", value: "birds" },
  ]}
  searchable
  clearable
  value={val}
  onChange={(v) => setVal(v)}
/>
```

