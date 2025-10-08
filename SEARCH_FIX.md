# Search Fix - Changed Parameter from 'search' to 'title'

## Issue

Search không trả về đúng kết quả khi tìm kiếm theo title.

## Root Cause

Backend API expects the search parameter to be named `title`, not `search`.

## Solution

Changed the API parameter name from `search` to `title`.

## Changes Made

### 1. API Client (`src/lib/api.ts`)

**Before:**

```typescript
getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
```

**After:**

```typescript
getAll: async (params?: { page?: number; limit?: number; search?: string; title?: string }) => {
```

### 2. Find Jobs Page (`src/app/(dashboard)/find-jobs/page.tsx`)

**Before:**

```typescript
const params: { page: number; limit: number; search?: string } = {
  page: pagination.page,
  limit: pagination.limit,
};
if (searchQuery) {
  params.search = searchQuery;
}
```

**After:**

```typescript
const params: { page: number; limit: number; title?: string } = {
  page: pagination.page,
  limit: pagination.limit,
};
if (searchQuery) {
  params.title = searchQuery;
}
```

### 3. Added Console Logging for Debugging

```typescript
console.log("Fetching jobs with params:", params);
const response: ApiResponse = await api.jobs.getAll(params);
console.log("Jobs response:", response);
```

This helps verify what parameters are being sent and what response is received.

## API Endpoint

### Before (Not Working)

```
GET /api/v1/jobs?page=1&limit=10&search=frontend
```

### After (Working)

```
GET /api/v1/jobs?page=1&limit=10&title=frontend
```

## Testing

To verify the fix is working:

1. Open the Find Jobs page
2. Open browser DevTools (F12) → Console tab
3. Type something in the search field (e.g., "developer")
4. Wait 500ms or press Enter
5. Check the console logs:
   - Should see: `Fetching jobs with params: { page: 1, limit: 10, title: "developer" }`
   - Should see: `Jobs response:` with filtered results

## Expected Behavior

### Searching

- Type "frontend" → Shows only jobs with "frontend" in title
- Type "backend" → Shows only jobs with "backend" in title
- Type "designer" → Shows only jobs with "designer" in title

### Empty Search

- Clear search field → Shows all jobs
- Click "Clear search" link → Shows all jobs

## Backend Requirements

The backend API should:

1. Accept `title` as a query parameter
2. Filter jobs where `title` contains the search term
3. Case-insensitive search (recommended)
4. Return filtered results with pagination

Example backend filtering logic:

```javascript
// Pseudo-code
if (title) {
  jobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(title.toLowerCase())
  );
}
```

## Notes

- Frontend supports both `search` and `title` parameters now (for backward compatibility)
- Console logs added temporarily for debugging (can be removed later in production)
- Search still uses debouncing (500ms delay after typing stops)
- Pagination resets to page 1 when search query changes
- All three trigger methods still work (auto, button click, Enter key)

## Verification Checklist

- [x] Changed parameter from `search` to `title`
- [x] Updated TypeScript interfaces
- [x] Added console logging for debugging
- [x] Updated documentation
- [x] No TypeScript errors
- [ ] Test search with actual API
- [ ] Verify results are filtered correctly
- [ ] Test pagination with search active
- [ ] Test "Clear search" functionality

## If Still Not Working

Check these potential issues:

1. **Backend not implemented**: Backend might not support title filtering yet
2. **Different parameter name**: Backend might expect `keyword`, `q`, or `query` instead
3. **Case sensitivity**: Backend might be case-sensitive
4. **Partial match**: Backend might require exact match instead of contains
5. **API response format**: Response might not follow expected structure

To debug further:

- Check Network tab in DevTools → See actual API request/response
- Verify backend API documentation for correct parameter name
- Test API directly with tools like Postman or curl
- Check backend logs for errors
