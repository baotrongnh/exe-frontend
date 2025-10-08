# Toast Notification Integration

## Overview

Replaced all `alert()` calls with a custom toast notification system. Added business logic for CV requirement validation and applied job state tracking.

## Changes Made

### 1. Created Toast Component (`src/components/toast.tsx`)

- Custom toast notification system using React Context API
- Features:
  - Auto-dismiss after 5 seconds
  - Four toast types: `success`, `error`, `info`, `warning`
  - Fixed positioning (top-right corner)
  - Slide-in animation from right
  - Close button with X icon
  - Context provider and useToast hook

### 2. Updated Layout (`src/app/layout.tsx`)

- Added `ToastProvider` wrapper around the application
- Placed after `AuthProvider` to ensure auth context is available

### 3. Updated Find Jobs Page (`src/app/(dashboard)/find-jobs/page.tsx`)

- Imported `useToast` hook and `useRouter` from Next.js
- Added `appliedJobs` state (Set<string>) to track applied jobs
- Updated `handleApply` function:
  - Replaced `alert()` with `toast.showToast()`
  - Added CV requirement check for error message: `'You must upload at least one active CV before applying for jobs'`
  - Redirects to `/my-cv` page when CV is required (with 1.5s delay)
  - Marks job as applied in local state on success
- Updated Apply button:
  - Shows "Applied" text when job is in appliedJobs set
  - Changes to green background when applied
  - Disabled when already applied

### 4. Updated Job Detail Page (`src/app/(dashboard)/find-jobs/[id]/page.tsx`)

- Imported `useToast` hook and `useRouter` from Next.js
- Added `applied` state (boolean) to track if current job is applied
- Updated `handleApply` function:
  - Replaced `alert()` with `toast.showToast()`
  - Added same CV requirement check and redirect logic
  - Sets `applied` state to true on success
- Updated both Apply buttons (header and sidebar):
  - Show "Applied" text when applied state is true
  - Change to green background when applied
  - Disabled when already applied

## Toast Usage

### Success Toast

```typescript
toast.showToast("Apply job thành công!", "success");
```

### Error Toast

```typescript
toast.showToast("Có lỗi xảy ra khi apply job", "error");
```

### CV Requirement Flow

```typescript
if (
  errorMessage ===
  "You must upload at least one active CV before applying for jobs"
) {
  toast.showToast("Bạn cần upload CV trước khi apply job", "error");
  setTimeout(() => {
    router.push("/my-cv");
  }, 1500);
}
```

## Business Logic

### 1. CV Validation

- When applying for a job fails with message: `'You must upload at least one active CV before applying for jobs'`
- Shows error toast: "Bạn cần upload CV trước khi apply job"
- Waits 1.5 seconds
- Automatically redirects to `/my-cv` page

### 2. Applied State Tracking

- **Find Jobs Page**: Uses `Set<string>` to track multiple applied job IDs
- **Job Detail Page**: Uses boolean `applied` state for current job
- Applied jobs show:
  - "Applied" button text
  - Green background color (`bg-green-600`)
  - Disabled state (no more applications allowed)

### 3. Success Flow

- Shows success toast
- Marks job as applied
- Refreshes job data to update applications count
- Button changes to "Applied" state

## Styling

### Applied Button

- Background: `bg-green-600 hover:bg-green-700`
- Text: White
- State: Disabled

### Toast Container

- Position: Fixed, top-right corner
- Z-index: 50 (above most content)
- Animation: Slide in from right
- Auto-dismiss: 5 seconds

## Testing Checklist

- [ ] Apply job successfully - see success toast
- [ ] Apply job without CV - see error toast and redirect to /my-cv
- [ ] Button changes to "Applied" after successful application
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Toast can be manually closed with X button
- [ ] Multiple toasts stack properly
- [ ] Redirect to /my-cv works correctly
- [ ] Applied state persists during page session
- [ ] Applications count updates after successful application
