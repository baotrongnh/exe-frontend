# Components Structure

Cấu trúc components được tổ chức theo nguyên tắc **Feature-First + Atomic Design**

## 📁 Folder Structure

```
components/
├── layouts/          # Layout components (Navbar, Sidebar, Footer)
├── features/         # Feature-specific components (Wallet, Jobs, Auth)
├── shared/           # Shared/reusable components (LoadingSpinner, EmptyState)
└── ui/              # Base UI components from shadcn/ui
```

## 📋 Naming Conventions

- **PascalCase** for component files: `UserProfile.tsx`
- **kebab-case** for folders: `user-profile/`
- **camelCase** for utilities and hooks: `useAuth.ts`

## 🎯 Component Guidelines

### 1. layouts/

Layout components that wrap pages and provide structure:

- `Navbar.tsx` - Top navigation bar
- `Sidebar.tsx` - Side navigation (Admin, Employer, Dashboard)
- `Footer.tsx` - Footer component
- `PageLayout.tsx` - Common page wrapper

### 2. features/

Domain-specific components grouped by feature:

```
features/
├── wallet/
│   ├── WalletCard.tsx
│   ├── TransactionList.tsx
│   └── DepositForm.tsx
├── jobs/
│   ├── JobCard.tsx
│   ├── JobList.tsx
│   └── JobFilters.tsx
└── auth/
    ├── LoginForm.tsx
    └── SignupForm.tsx
```

### 3. shared/

Reusable components used across multiple features:

- `LoadingSpinner.tsx`
- `EmptyState.tsx`
- `ErrorBoundary.tsx`
- `Pagination.tsx`

### 4. ui/

Base UI components (Button, Input, Card, etc.) - managed by shadcn/ui

## 🔧 Usage Examples

```tsx
// ✅ Good - Clear imports
import { Navbar } from "@/components/layouts/Navbar";
import { WalletCard } from "@/components/features/wallet/WalletCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";

// ❌ Bad - Unclear organization
import { Navbar } from "@/components/Navbar";
import { Component1 } from "@/components/component1";
```

## 📝 Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Composition**: Prefer composition over inheritance
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Naming**: Use descriptive names that indicate what the component does
5. **File Size**: Keep components under 300 lines. Split if larger

## 🚀 Migration Plan

Existing components will be gradually moved to new structure:

- `admin-sidebar.tsx` → `layouts/AdminSidebar.tsx`
- `employer-sidebar.tsx` → `layouts/EmployerSidebar.tsx`
- `wallet-card.tsx` → `features/wallet/WalletCard.tsx`
- `toast.tsx` → `shared/Toast.tsx`
