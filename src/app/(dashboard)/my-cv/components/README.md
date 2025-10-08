# My CV Components

This directory contains all the modular components for the My CV page, following a clean architecture pattern.

## Component Structure

### Core Components

- **`CVPageHeader`** - Page title and description header
- **`UploadButton`** - Main upload CV button
- **`CVGrid`** - Grid layout for displaying CV cards with loading and empty states
- **`CVCard`** - Individual CV card with preview, actions, and metadata
- **`EmptyState`** - Displayed when no CVs are uploaded
- **`LoadingSpinner`** - Loading states for auth and general loading
- **`AuthRequired`** - Authentication required message

### Modal Components

- **`UploadModal`** - Modal for uploading new CVs
- **`EditModal`** - Modal for editing existing CVs
- **`DetailModal`** - Modal for viewing CV details with full preview

### Utilities

- **`types.ts`** - TypeScript interfaces and types
- **`utils.ts`** - Utility functions for formatting dates and file sizes
- **`useCVManagement.ts`** - Custom hook for CV management logic

## Usage

Import components from the main index file:

```tsx
import { CVPageHeader, UploadButton, CVGrid, useCVManagement, type CV } from "./components";
```

## Benefits of This Structure

1. **Separation of Concerns** - Each component has a single responsibility
2. **Reusability** - Components can be easily reused across different parts of the app
3. **Maintainability** - Easy to locate and modify specific features
4. **Testability** - Each component can be tested in isolation
5. **Type Safety** - Centralized type definitions ensure consistency
6. **Custom Hook** - Business logic is separated from UI components

## File Organization

```
components/
├── index.ts              # Main export file
├── types.ts              # TypeScript interfaces
├── utils.ts              # Utility functions
├── useCVManagement.ts    # Custom hook for CV operations
├── LoadingSpinner.tsx    # Loading components
├── AuthRequired.tsx      # Authentication required component
├── CVPageHeader.tsx      # Page header component
├── UploadButton.tsx      # Upload button component
├── EmptyState.tsx        # Empty state component
├── CVCard.tsx            # Individual CV card component
├── CVGrid.tsx            # Grid layout component
├── UploadModal.tsx       # Upload modal component
├── EditModal.tsx         # Edit modal component
└── DetailModal.tsx       # Detail view modal component
```

This modular approach makes the codebase more scalable and maintainable while preserving all the original functionality.
