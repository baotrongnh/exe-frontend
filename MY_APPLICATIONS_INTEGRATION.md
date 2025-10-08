# My Applications Page - API Integration

## Overview

Integrated the My Applications page with the real API endpoint `/api/v1/applications` to fetch and display user's job applications with pagination.

## Changes Made

### 1. Updated API Client (`src/lib/api.ts`)

Added `getAll` method to applications API:

```typescript
applications: {
     getAll: async (params?: { page?: number; limit?: number }) => {
          const response = await apiClient.get('/applications', { params })
          return response.data
     },
     apply: async (jobId: string) => {
          const response = await apiClient.post(`/applications/${jobId}`)
          return response.data
     },
}
```

### 2. Updated My Applications Page (`src/app/(dashboard)/my-applications/page.tsx`)

#### Added TypeScript Interfaces

```typescript
interface Application {
  id: string;
  user_id: string;
  job_id: string;
  cv_id: string;
  status: string;
  cover_letter: string | null;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    company?: string;
    owner_id: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Application[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

#### Added State Management

- `applications`: Array of Application objects from API
- `loading`: Loading state for data fetch
- `error`: Error message state
- `pagination`: Pagination info (total, page, limit, pages)

#### Added Data Fetching

```typescript
useEffect(() => {
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response: ApiResponse = await api.applications.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      console.log("Applications API Response:", response);
      setApplications(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      setError(null);
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      setError(
        err.response?.data?.message || "Không thể tải danh sách applications"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
}, [pagination.page]);
```

#### Added Helper Functions

1. **getStatusColor**: Maps status to Tailwind color classes

   - PENDING / IN_REVIEW → Orange
   - SHORTLISTED → Emerald
   - INTERVIEWING → Yellow
   - OFFERED → Indigo
   - HIRED → Green
   - REJECTED → Red
   - WITHDRAWN → Gray

2. **getInitials**: Extracts initials from job title for avatar

3. **getRandomColor**: Returns random background color for logo

4. **formatDate**: Formats date string to "DD Month YYYY"

5. **formatStatus**: Formats status string (e.g., "IN_REVIEW" → "In Review")

#### Updated Table Rendering

- Shows loading state while fetching
- Shows error message if fetch fails
- Shows empty state if no applications
- Displays real application data:
  - Row number with pagination offset
  - Job title as employer name
  - Job title as role
  - Created date as date applied
  - Status with dynamic color badges
  - Action menu button

#### Updated Pagination

- Only shows if more than 1 page
- Previous/Next buttons with disabled states
- Page number buttons (shows first 5 pages)
- Shows ellipsis and last page if more than 5 pages
- Fully functional page navigation

#### Updated Tabs

- "All" tab shows `pagination.total` count from API
- Other tabs still show mock counts (can be updated later)

### 3. Fixed Sidebar Navigation (`src/components/dashboard-sidebar.tsx`)

Changed navigation paths to include `/dashboard` prefix:

- ✅ `/dashboard/my-applications` (was `my-applications`)
- ✅ `/dashboard/find-jobs` (was `find-jobs`)

## API Response Structure

Based on the integration, the expected response format is:

```json
{
  "success": true,
  "data": [
    {
      "id": "app-id",
      "user_id": "user-id",
      "job_id": "job-id",
      "cv_id": "cv-id",
      "status": "PENDING",
      "cover_letter": null,
      "createdAt": "2025-02-03T10:30:00.000Z",
      "updatedAt": "2025-02-03T10:30:00.000Z",
      "job": {
        "id": "job-id",
        "title": "Frontend Developer",
        "company": "Tech Corp",
        "owner_id": "employer-id"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

## Status Mapping

| API Status   | Display      | Color   |
| ------------ | ------------ | ------- |
| PENDING      | Pending      | Orange  |
| IN_REVIEW    | In Review    | Orange  |
| SHORTLISTED  | Shortlisted  | Emerald |
| INTERVIEWING | Interviewing | Yellow  |
| OFFERED      | Offered      | Indigo  |
| HIRED        | Hired        | Green   |
| REJECTED     | Rejected     | Red     |
| WITHDRAWN    | Withdrawn    | Gray    |

## Features Implemented

✅ Real-time data fetching from API
✅ Loading states
✅ Error handling with user-friendly messages
✅ Empty state display
✅ Dynamic pagination with navigation
✅ Status color coding
✅ Date formatting (DD Month YYYY format)
✅ Row numbering with pagination offset
✅ Dynamic "All" tab count from API
✅ Console logging for debugging

## Testing Checklist

- [ ] Page loads and fetches applications
- [ ] Loading state shows while fetching
- [ ] Applications display correctly in table
- [ ] Status badges show correct colors
- [ ] Dates format correctly
- [ ] Pagination works (previous/next/page numbers)
- [ ] Empty state shows when no applications
- [ ] Error state shows on API failure
- [ ] Tab count shows total from API
- [ ] Navigation from sidebar works correctly
- [ ] Console logs show API response for debugging

## Future Enhancements

1. **Filter by Status**: Implement tab filtering to show only applications with specific status
2. **Search Functionality**: Add search by job title
3. **Date Range Filter**: Use the calendar button to filter by date range
4. **Action Menu**: Implement actions in the "..." menu (View, Withdraw, etc.)
5. **Status Counts**: Fetch individual status counts for all tabs
6. **Cover Letter Display**: Show cover letter in a modal or detail view
7. **Job Details Link**: Make job title clickable to navigate to job detail page
8. **Refresh Button**: Add manual refresh capability
9. **Real-time Updates**: Use WebSocket or polling for status updates
10. **Export**: Add ability to export applications list

## Notes

- Mock data is kept in the file (commented) for reference
- Console.log statements added for debugging API responses
- The page maintains pagination state across tab switches
- Pagination only shows when there's more than 1 page
- Default limit is 10 applications per page
