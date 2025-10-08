# API Integration Guide

## 📁 Cấu trúc File

### `src/lib/api.ts` - API Client chính

File này chứa axios client đã được cấu hình sẵn để gọi backend API với authentication tự động.

## 🚀 Cách sử dụng

### 1. Import API client

```typescript
import { api } from "@/lib/api";
```

### 2. Gọi Jobs API

#### Lấy danh sách jobs

```typescript
// Lấy tất cả jobs
const response = await api.jobs.getAll();
console.log(response.data); // Array of jobs
console.log(response.pagination); // Pagination info

// Với pagination
const response = await api.jobs.getAll({ page: 2, limit: 20 });
```

#### Lấy job theo ID

```typescript
const job = await api.jobs.getById("job-id-here");
```

#### Tạo mới job

```typescript
const newJob = await api.jobs.create({
  title: "Frontend Developer",
  description: "Build awesome UI",
  job_type: "FULL_TIME",
  budget_type: "FIXED",
  budget_min: "20000000",
  budget_max: "30000000",
  currency: "VND",
  experience_level: "MIDDLE",
  skills_required: ["React", "TypeScript"],
});
```

#### Cập nhật job

```typescript
const updated = await api.jobs.update("job-id", {
  title: "Senior Frontend Developer",
});
```

#### Xóa job

```typescript
await api.jobs.delete("job-id");
```

### 3. Gọi Applications API

#### Apply job

```typescript
// Apply vào một job
try {
  const response = await api.applications.apply("job-id-here");
  console.log("Apply thành công!", response);
} catch (error) {
  console.error("Lỗi khi apply:", error.response?.data?.message);
}
```

**Lưu ý**: API này tự động sử dụng Bearer token từ Supabase authentication.

## 📊 Cấu trúc dữ liệu từ API

### Job Object

```typescript
{
  id: string
  owner_id: string
  title: string
  description: string
  job_type: 'FREELANCE' | 'PART_TIME' | 'PROJECT' | 'FULL_TIME'
  budget_type: 'FIXED' | 'HOURLY'
  budget_min: string (số dưới dạng string)
  budget_max: string
  currency: string ('VND' hoặc 'USD')
  experience_level: 'INTERN' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'
  deadline: string | null (ISO date format)
  status: string
  applications_count: number
  skills_required: string[]
  rejection_reason: string | null
  createdAt: string | null
  updatedAt: string | null
  category_id: string | null
}
```

### API Response

```typescript
{
  success: boolean
  data: Job[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
```

## ➕ Thêm API mới

Để thêm API endpoint mới, chỉnh sửa file `src/lib/api.ts`:

```typescript
export const api = {
  jobs: { ... },

  // Thêm API mới
  users: {
    getProfile: async () => {
      const response = await apiClient.get('/users/profile')
      return response.data
    },

    updateProfile: async (data: any) => {
      const response = await apiClient.put('/users/profile', data)
      return response.data
    },
  },

  applications: {
    getAll: async () => {
      const response = await apiClient.get('/applications')
      return response.data
    },

    apply: async (jobId: string) => {
      const response = await apiClient.post(`/applications`, { job_id: jobId })
      return response.data
    },
  }
}
```

## 🔐 Authentication

Access token từ Supabase sẽ **TỰ ĐỘNG** được thêm vào header của mỗi request:

```
Authorization: Bearer <access_token>
```

Bạn không cần lo lắng về việc này!

## 🛠️ Custom API Call

Nếu cần gọi API không có trong `api` object, sử dụng `apiClient` trực tiếp:

```typescript
import apiClient from "@/lib/api";

// GET request
const response = await apiClient.get("/custom-endpoint", {
  params: { filter: "active" },
});

// POST request
const response = await apiClient.post("/custom-endpoint", {
  data: "value",
});

// PUT request
const response = await apiClient.put("/custom-endpoint/123", {
  updated: "value",
});

// DELETE request
const response = await apiClient.delete("/custom-endpoint/123");
```

## ⚠️ Error Handling

API client tự động xử lý lỗi 401 (Unauthorized). Bạn nên wrap API calls trong try-catch:

```typescript
try {
  const jobs = await api.jobs.getAll();
  setJobs(jobs.data);
} catch (error: any) {
  console.error("Error:", error.message);
  // Hiển thị thông báo lỗi cho user
}
```

## 📝 Ví dụ trong React Component

```typescript
"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.jobs.getAll();
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {jobs.map((job) => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}
```

## 🌐 API Base URL

Hiện tại: `http://14.169.93.37:3003/api/v1`

Để thay đổi, chỉnh sửa trong file `src/lib/api.ts`:

```typescript
const API_BASE_URL = "http://your-new-url.com/api/v1";
```

## ✅ Best Practices

1. **Luôn sử dụng try-catch** khi gọi API
2. **Hiển thị loading state** khi fetch data
3. **Validate data** trước khi gửi lên server
4. **Type safety**: Sử dụng TypeScript interfaces cho API responses
5. **Reusable**: Tạo custom hooks cho các API calls thường dùng

Ví dụ custom hook:

```typescript
// hooks/useJobs.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useJobs(page = 1, limit = 10) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.jobs.getAll({ page, limit });
        setJobs(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page, limit]);

  return { jobs, loading, error };
}

// Sử dụng trong component
const { jobs, loading, error } = useJobs(1, 10);
```
