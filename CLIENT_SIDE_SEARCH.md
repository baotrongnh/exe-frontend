# Client-Side Search with Highlighting

## Overview

Implemented client-side filtering for job search with text highlighting for matched keywords.

## How It Works

### 1. Data Fetching Strategy

- **Fetch once on mount**: Load all jobs (up to 100) from API on component mount
- **Store in `allJobs`**: Keep complete dataset for filtering
- **Client-side filtering**: Filter jobs based on search query without additional API calls

### 2. Search & Filter Flow

```
User types "developer"
     ↓
Debounce 500ms
     ↓
setSearchQuery("developer")
     ↓
Filter allJobs where title includes "developer"
     ↓
Apply pagination to filtered results
     ↓
Display filtered jobs with highlighted text
```

### 3. Text Highlighting

When search is active, matching text in job titles is:

- **Bold** (`font-bold`)
- **Primary color** (`text-primary`)
- **Background highlight** (`bg-primary/10`)
- **Rounded padding** for visual emphasis

Example:

- Search: "frontend"
- Title: "Senior Frontend Developer"
- Display: "Senior **Frontend** Developer" (Frontend is highlighted)

## Implementation Details

### State Management

```typescript
const [allJobs, setAllJobs] = useState<Job[]>([]); // All fetched jobs
const [jobs, setJobs] = useState<Job[]>([]); // Filtered & paginated jobs
const [searchQuery, setSearchQuery] = useState(""); // Active search term
```

### Fetching All Jobs

```typescript
useEffect(() => {
  const fetchJobs = async () => {
    const response = await api.jobs.getAll({
      page: 1,
      limit: 100, // Fetch more for client-side filtering
    });
    setAllJobs(response.data || []);
  };
  fetchJobs();
}, []); // Only fetch once
```

### Client-Side Filtering

```typescript
useEffect(() => {
  if (!searchQuery) {
    // No search - show all with pagination
    const paginatedJobs = allJobs.slice(startIndex, endIndex);
    setJobs(paginatedJobs);
  } else {
    // Filter by search query (case-insensitive)
    const filtered = allJobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Apply pagination to filtered results
    const paginatedJobs = filtered.slice(startIndex, endIndex);
    setJobs(paginatedJobs);
  }
}, [allJobs, searchQuery, pagination.page]);
```

### Text Highlighting Function

```typescript
const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={index}
            className="font-bold text-primary bg-primary/10 px-1 rounded"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};
```

### Usage in Job Card

```tsx
<h3 className="font-semibold text-lg text-foreground mb-1">
  {highlightText(job.title, searchQuery)}
</h3>
```

## Features

### ✅ Exact Match Filtering

- Only shows jobs where title contains the search term
- Case-insensitive matching
- Partial matches supported (e.g., "dev" matches "Developer", "Development")

### ✅ Visual Highlighting

- Matched text is bold and highlighted
- Primary color for emphasis
- Light background for readability
- Rounded padding for visual appeal

### ✅ Smart Pagination

- Pagination applies AFTER filtering
- Shows correct total count for filtered results
- Page numbers update based on filtered data
- Resets to page 1 when search changes

### ✅ Empty State Messages

- "Không tìm thấy công việc nào với từ khóa '[query]'" when search returns no results
- "Không có công việc nào" when no jobs exist at all

### ✅ Performance

- No API calls during search (uses cached data)
- Instant results (no network latency)
- Debounced input (smooth typing experience)

## Example Scenarios

### Scenario 1: Search for "Frontend"

**Input:** User types "frontend"

**Process:**

1. Debounce 500ms
2. Filter: `allJobs.filter(job => job.title.toLowerCase().includes('frontend'))`
3. Results: ["Senior Frontend Developer", "Frontend Engineer", "Full-stack (Frontend focus)"]
4. Display: Each title with "frontend" highlighted in bold

**Result Count:** "Showing 3 of 3 results"

### Scenario 2: Search for "React"

**Input:** User types "react"

**Process:**

1. Filter jobs containing "react" in title
2. Apply pagination (10 per page)
3. Highlight "react" in matching titles

**If 15 results:**

- Page 1: Shows 10 results
- Page 2: Shows 5 results
- "Showing 10 of 15 results" → Navigate → "Showing 5 of 15 results"

### Scenario 3: No Results

**Input:** User types "xyz123"

**Process:**

1. Filter returns empty array
2. Pagination shows 0 results
3. Empty state displayed

**Message:** "Không tìm thấy công việc nào với từ khóa 'xyz123'"

### Scenario 4: Clear Search

**Input:** User clicks "Clear search" or deletes text

**Process:**

1. searchQuery = ''
2. Shows all jobs from allJobs
3. Normal pagination applies
4. No highlighting

**Result:** "Showing 10 of 45 results" (all jobs)

## Styling

### Highlight Styles

```css
.font-bold          /* Bold text */
/* Bold text */
.text-primary       /* Primary theme color */
.bg-primary/10      /* Light primary background (10% opacity) */
.px-1               /* Horizontal padding */
.rounded; /* Rounded corners */
```

### Visual Example

```
Normal text:    Senior Frontend Developer
Highlighted:    Senior [Frontend] Developer
                       ↑ bold, primary color, light bg
```

## Advantages

### Client-Side Filtering

✅ Instant results (no API delay)
✅ No backend changes needed
✅ Reduced server load
✅ Works offline (after initial load)
✅ Better user experience

### Text Highlighting

✅ Clear visual feedback
✅ Easy to spot matches
✅ Improves readability
✅ Professional appearance

## Limitations & Considerations

### Data Limit

- Currently fetches 100 jobs max
- For larger datasets, may need:
  - Increase limit
  - Implement server-side search
  - Load more on scroll

### Search Scope

- Only searches in job **title**
- Doesn't search description or skills
- Can be extended to search multiple fields

### Case Sensitivity

- Current: Case-insensitive
- All searches are lowercase compared
- "Frontend" = "frontend" = "FRONTEND"

### Performance

- **Good**: Up to ~500 jobs
- **OK**: 500-1000 jobs
- **Consider server-side**: 1000+ jobs

## Future Enhancements

1. **Multi-field Search**

   - Search in title, description, skills
   - Weighted results (title > description)

2. **Fuzzy Search**

   - Handle typos
   - Suggest corrections

3. **Search History**

   - Store recent searches
   - Quick re-search

4. **Highlight in Description**

   - Extend highlighting to job description
   - Show context snippets

5. **Advanced Filters**

   - Combine search with filters
   - Filter by type, level, salary

6. **Virtual Scrolling**
   - Handle thousands of jobs
   - Load as user scrolls

## Testing Checklist

- [x] Search filters jobs correctly
- [x] Only matching jobs displayed
- [x] Text highlighting works
- [x] Case-insensitive search
- [x] Pagination updates with filtered results
- [x] Empty state shows correct message
- [x] Clear search resets to all jobs
- [x] Highlight styling looks good
- [ ] Test with various search terms
- [ ] Test with special characters
- [ ] Test with very long titles
- [ ] Performance test with 100 jobs

## Notes

- Highlighting uses React fragments for safe rendering
- RegEx split preserves case for display
- Comparison is case-insensitive
- Multiple matches in same title all highlighted
- Safe against XSS (React escapes content)
