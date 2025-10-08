# Find Jobs - Search Functionality

## Overview

Added search functionality to the Find Jobs page, allowing users to search for jobs by title or keyword with debounced input and instant results.

## Changes Made

### 1. Updated API Client (`src/lib/api.ts`)

Added `search` parameter to the `jobs.getAll` method:

```typescript
jobs: {
     getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
          const response = await apiClient.get('/jobs', { params })
          return response.data
     },
     // ... other methods
}
```

### 2. Updated Find Jobs Page (`src/app/(dashboard)/find-jobs/page.tsx`)

#### Added State Management

```typescript
const [searchQuery, setSearchQuery] = useState(""); // Actual search query sent to API
const [searchInput, setSearchInput] = useState(""); // User input in search field
```

#### Added Debounced Search Effect

Automatically triggers search 500ms after user stops typing:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setSearchQuery(searchInput);
    // Reset to page 1 when search changes
    if (searchInput !== searchQuery) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  }, 500); // 500ms debounce

  return () => clearTimeout(timer);
}, [searchInput]);
```

#### Updated fetchJobs Function

Now includes search parameter if query exists:

```typescript
const params: { page: number; limit: number; search?: string } = {
  page: pagination.page,
  limit: pagination.limit,
};
if (searchQuery) {
  params.search = searchQuery;
}
const response: ApiResponse = await api.jobs.getAll(params);
```

#### Added Handler Functions

1. **handleSearchInputChange**: Updates search input state as user types
2. **handleSearch**: Manually triggers search when button clicked
3. **handleKeyPress**: Triggers search when Enter key is pressed

#### Updated Search Input

```tsx
<Input
  placeholder="Job title or keyword"
  className="pl-10"
  value={searchInput}
  onChange={handleSearchInputChange}
  onKeyPress={handleKeyPress}
/>
```

#### Updated Search Button

```tsx
<Button
  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
  onClick={handleSearch}
>
  Search
</Button>
```

#### Enhanced Results Header

Shows search context and clear button:

```tsx
<h2 className="text-xl font-bold text-foreground mb-1">
     {searchQuery ? `Search Results for "${searchQuery}"` : 'All Jobs'}
</h2>
<p className="text-sm text-muted-foreground">
     Showing {jobs.length} of {pagination.total} results
     {searchQuery && (
          <button
               onClick={() => {
                    setSearchInput('')
                    setSearchQuery('')
                    setPagination(prev => ({ ...prev, page: 1 }))
               }}
               className="ml-2 text-primary hover:underline"
          >
               Clear search
          </button>
     )}
</p>
```

## Features

### ✅ Debounced Search (500ms)

- Automatically searches 500ms after user stops typing
- Reduces unnecessary API calls
- Provides smooth user experience

### ✅ Multiple Trigger Methods

1. **Auto-trigger**: After 500ms of no typing
2. **Button click**: Click "Search" button
3. **Enter key**: Press Enter in search field

### ✅ Smart Pagination Reset

- Automatically returns to page 1 when search query changes
- Maintains page number when navigating search results

### ✅ Search Status Display

- Shows "Search Results for '[query]'" when searching
- Shows "All Jobs" when no search active
- Displays result count

### ✅ Clear Search Function

- "Clear search" button appears when search is active
- Resets search input and query
- Returns to page 1 with all jobs

### ✅ Real-time Updates

- Results update as you type (with debounce)
- Loading state shown during fetch
- Error handling for failed searches

## User Flow

1. **User types in search field**
   → Input updates in real-time
   → After 500ms of no typing, search triggers
   → Loading state shows
   → Results update

2. **User clicks Search button**
   → Immediately triggers search
   → Bypasses debounce delay

3. **User presses Enter**
   → Immediately triggers search
   → Same as button click

4. **User clears search**
   → Click "Clear search" link
   → Search input cleared
   → All jobs displayed
   → Returns to page 1

## API Integration

The search parameter is sent to the backend API using the `title` parameter:

```
GET /api/v1/jobs?page=1&limit=10&title=frontend
```

Backend should handle the search by filtering jobs where the title contains the search term (case-insensitive recommended).

**Note**: Changed from `search` to `title` parameter to match backend API requirements.

## Example Usage

**Search for "frontend":**

- URL params: `?title=frontend&page=1&limit=10`
- Results: All jobs with "frontend" in title
- Header: "Search Results for 'frontend'"

**Clear search:**

- URL params: `?page=1&limit=10`
- Results: All jobs
- Header: "All Jobs"

## Technical Details

### State Management

- `searchInput`: Controlled input value (immediate)
- `searchQuery`: Actual query sent to API (debounced)
- Two-state approach allows debouncing without UI lag

### Debounce Implementation

- Uses `setTimeout` with cleanup
- 500ms delay is configurable
- Cancels previous timer on each keystroke

### Dependencies in useEffect

```typescript
}, [pagination.page, searchQuery])
```

- Refetches when page changes
- Refetches when search query changes
- Does NOT refetch on every keystroke (thanks to debounce)

## Testing Checklist

- [ ] Type in search field - results update after 500ms
- [ ] Click Search button - immediate search
- [ ] Press Enter key - immediate search
- [ ] Search returns correct filtered results
- [ ] Pagination works with search active
- [ ] Clear search button appears when searching
- [ ] Clear search returns all jobs
- [ ] Loading state shows during search
- [ ] Error handling works for failed searches
- [ ] Empty results show appropriate message
- [ ] Search persists during pagination
- [ ] Search resets to page 1 on new query

## Future Enhancements

1. **Search History**: Store recent searches in localStorage
2. **Search Suggestions**: Show autocomplete suggestions
3. **Advanced Filters**: Combine search with filters
4. **Highlight Matches**: Highlight search terms in results
5. **Search by Multiple Fields**: Search in description, skills, etc.
6. **Search Analytics**: Track popular search terms
7. **Saved Searches**: Allow users to save favorite searches
8. **URL Query Params**: Reflect search in URL for sharing
9. **Keyboard Navigation**: Arrow keys through results
10. **Voice Search**: Add voice input option

## Performance Considerations

- ✅ Debouncing reduces API calls
- ✅ Cleanup function prevents memory leaks
- ✅ Pagination maintained with search
- ✅ Loading states prevent multiple simultaneous requests
- ✅ Empty search doesn't send unnecessary parameter

## Notes

- Search is case-sensitive/insensitive based on backend implementation
- Minimum characters for search: None (can be added if needed)
- Search applies to job title by default (can be extended)
- Debounce delay of 500ms is optimal for most use cases
