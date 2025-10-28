# Admin Dashboard API Integration

## Tổng quan

Tích hợp API Dashboard Admin cho hệ thống JobBoost với các tính năng:

- ✅ Dashboard Overview (Tổng quan hệ thống)
- ✅ Revenue Management (Quản lý doanh thu)
- ✅ Transactions Log (Lịch sử giao dịch)
- ✅ Reviews Moderation (Quản lý đánh giá)
- ✅ Users Management (Quản lý người dùng)

## Cấu trúc Files

```
src/
├── types/
│   └── admin.ts                           # TypeScript types cho Admin Dashboard
├── lib/
│   └── admin-dashboard-api.ts             # API service cho Admin Dashboard
└── app/
    └── admin/
        ├── dashboard/
        │   └── page.tsx                   # Trang Dashboard chính
        ├── revenue/
        │   └── page.tsx                   # Trang quản lý doanh thu
        ├── transactions/
        │   └── page.tsx                   # Trang lịch sử giao dịch
        └── reviews/
            └── page.tsx                   # Trang quản lý đánh giá
```

## API Configuration

### Base URL

API hiện đang sử dụng `http://localhost:5000` để test trên máy local.

File: `src/lib/admin-dashboard-api.ts`

```typescript
const ADMIN_API_BASE_URL = "http://localhost:5000";
```

### Thay đổi Base URL

Để thay đổi sang môi trường khác:

1. **Production**:

   ```typescript
   const ADMIN_API_BASE_URL = "http://14.169.15.9:3003";
   ```

2. **Staging**:

   ```typescript
   const ADMIN_API_BASE_URL = "http://your-staging-url:3003";
   ```

3. **Environment Variable** (Recommended):

   ```typescript
   const ADMIN_API_BASE_URL =
     process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:5000";
   ```

   Thêm vào `.env.local`:

   ```
   NEXT_PUBLIC_ADMIN_API_URL=http://localhost:5000
   ```

## API Endpoints

### 1. Dashboard Overview

```typescript
GET / admin / dashboard / overview
  ? (period =
      week -
      // Parameters:
      period)
  : "today" | "week" | "month" | "year" | "all";
```

**Response:**

- Revenue statistics
- User statistics
- Transaction breakdown
- Jobs status
- Reviews summary

### 2. Revenue Details

```typescript
GET /admin/dashboard/revenue?page=1&limit=20

// Parameters:
- page: number
- limit: number
- startDate: string (YYYY-MM-DD)
- endDate: string (YYYY-MM-DD)
- sortBy: 'amount' | 'createdAt'
- sortOrder: 'ASC' | 'DESC'
```

### 3. Revenue Chart

```typescript
GET / admin / dashboard / revenue / chart
  ? (period =
      month -
      // Parameters:
      period)
  : "day" | "week" | "month" | "year";
```

### 4. Users Management

```typescript
GET /admin/dashboard/users?role=freelancer&verified=true

// Parameters:
- page: number
- limit: number
- role: 'freelancer' | 'employer'
- verified: boolean
- search: string
- sortBy: 'created_at' | 'balance' | 'jobs' | 'applications'
- sortOrder: 'ASC' | 'DESC'
```

### 5. Transactions

```typescript
GET /admin/dashboard/transactions?type=DEPOSIT&status=SUCCESS

// Parameters:
- page: number
- limit: number
- type: 'JOB_POST' | 'DEPOSIT' | 'REFUND' | 'WITHDRAW'
- status: 'SUCCESS' | 'PENDING' | 'FAILED'
- startDate: string
- endDate: string
- minAmount: number
- maxAmount: number
- sortBy: 'amount' | 'createdAt'
- sortOrder: 'ASC' | 'DESC'
```

### 6. Reviews

```typescript
GET /admin/dashboard/reviews?rating=5&verified=true

// Parameters:
- page: number
- limit: number
- role: 'freelancer' | 'employer'
- rating: number (1-5)
- verified: boolean
- status: 'active' | 'hidden' | 'flagged'
- startDate: string
- endDate: string
- sortBy: 'rating' | 'helpful_count' | 'createdAt'
- sortOrder: 'ASC' | 'DESC'
```

## Sử dụng API Service

### Import API Service

```typescript
import { adminDashboardApi } from "@/lib/admin-dashboard-api";
// hoặc import individual functions
import { getOverview, getRevenue } from "@/lib/admin-dashboard-api";
```

### Ví dụ sử dụng

#### 1. Get Dashboard Overview

```typescript
const fetchOverview = async () => {
  try {
    const response = await adminDashboardApi.getOverview({ period: "week" });
    if (response.success) {
      console.log("Overview:", response.data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

#### 2. Get Revenue with Pagination

```typescript
const fetchRevenue = async () => {
  const params = {
    page: 1,
    limit: 20,
    sortBy: "amount" as const,
    sortOrder: "DESC" as const,
  };

  const response = await adminDashboardApi.getRevenue(params);
  if (response.success) {
    console.log("Revenue:", response.data);
  }
};
```

#### 3. Filter Transactions

```typescript
const fetchTransactions = async () => {
  const params = {
    type: "DEPOSIT" as const,
    status: "SUCCESS" as const,
    minAmount: 100000,
    page: 1,
    limit: 50,
  };

  const response = await adminDashboardApi.getTransactions(params);
  console.log("Transactions:", response.data);
};
```

## Authentication

API tự động thêm Bearer token vào mọi request:

```typescript
Authorization: Bearer<admin_access_token>;
```

Token được lấy từ Supabase session và tự động inject bởi axios interceptor.

### Kiểm tra Authentication

```typescript
// Token được lấy tự động từ Supabase
const {
  data: { session },
} = await supabase.auth.getSession();
// session.access_token sẽ được thêm vào header
```

## Error Handling

API service tự động xử lý các lỗi phổ biến:

```typescript
try {
  const response = await adminDashboardApi.getOverview();
} catch (error: any) {
  if (error.response?.status === 401) {
    // Unauthorized - User chưa đăng nhập
    console.error("Please login as admin");
  } else if (error.response?.status === 403) {
    // Forbidden - Không có quyền admin
    console.error("Admin access required");
  } else {
    // Other errors
    console.error(error.response?.data?.message || "Unknown error");
  }
}
```

## Testing

### 1. Start Backend Server

Đảm bảo backend đang chạy trên `http://localhost:5000`:

```bash
cd jobboost-backend
npm run dev
```

### 2. Start Frontend

```bash
cd exe-frontend
npm run dev
```

### 3. Access Admin Pages

- Dashboard: http://localhost:3000/admin/dashboard
- Revenue: http://localhost:3000/admin/revenue
- Transactions: http://localhost:3000/admin/transactions
- Reviews: http://localhost:3000/admin/reviews

### 4. Test với Admin Account

Login với account có quyền admin để test các endpoints.

## TypeScript Types

Tất cả types đã được định nghĩa trong `src/types/admin.ts`:

```typescript
import type {
  DashboardOverview,
  RevenueData,
  TransactionsData,
  ReviewsData,
  UsersData,
  // ... và nhiều types khác
} from "@/types/admin";
```

## Features

### 1. Dashboard Page (`/admin/dashboard`)

- ✅ Tổng quan các chỉ số quan trọng
- ✅ Filter theo thời gian (Today, Week, Month, Year, All)
- ✅ Hiển thị revenue, users, jobs, reviews statistics
- ✅ Real-time data từ API
- ✅ Loading states và error handling

### 2. Revenue Page (`/admin/revenue`)

- ✅ Danh sách chi tiết giao dịch revenue
- ✅ Summary cards (Total, Avg, Min, Max)
- ✅ Pagination
- ✅ Sort by amount/date

### 3. Transactions Page (`/admin/transactions`)

- ✅ Danh sách tất cả giao dịch
- ✅ Filter by type, status, amount range
- ✅ Transaction breakdown by type
- ✅ Pagination và sorting

### 4. Reviews Page (`/admin/reviews`)

- ✅ Danh sách đánh giá từ users
- ✅ Filter by role, rating, verified status
- ✅ Display aspect ratings
- ✅ Rating statistics
- ✅ Pagination

## Utilities

### Format Currency

```typescript
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
```

### Format Number

```typescript
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};
```

### Format Date

```typescript
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("vi-VN");
};
```

## Troubleshooting

### CORS Error

Nếu gặp CORS error, đảm bảo backend đã cấu hình CORS:

```typescript
// Backend: src/index.ts
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### Authentication Error

Nếu API trả về 401/403:

1. Kiểm tra đã login với admin account
2. Verify admin role trong database
3. Check token expiration

### Network Error

Nếu không kết nối được API:

1. Kiểm tra backend đang chạy: `http://localhost:5000`
2. Verify URL trong `admin-dashboard-api.ts`
3. Check firewall/network settings

## Next Steps

1. ✅ Tích hợp Users Management page
2. ✅ Add Revenue Chart visualization
3. ✅ Export data functionality
4. ✅ Advanced filters
5. ✅ Real-time updates với WebSocket

## Documentation

Chi tiết API specification: `docs/admin-dashboard-api.md`

## Support

Nếu có vấn đề, check:

1. Console logs để xem errors
2. Network tab trong DevTools
3. Backend logs
4. API documentation

---

**Created:** October 27, 2025
**Version:** 1.0.0
**API Base URL:** http://localhost:5000
