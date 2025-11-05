# Video Call API Configuration Update

## Thay đổi

Video Call API đã được cấu hình để gọi từ server riêng: **`http://localhost:5000`**

## Chi tiết kỹ thuật

### API Base URLs (trong `src/lib/api.ts`)

```typescript
const API_BASE_URL = "http://14.169.15.9:3003"; // General API
const CV_API_BASE_URL = "http://14.169.15.9:3003/api"; // CV API
const VIDEO_CALL_API_BASE_URL = "http://localhost:5000"; // Video Call API ⭐ NEW
```

### Axios Instances

- **`apiClient`**: Dùng cho general APIs (jobs, applications, wallet, conversations, etc.)
- **`cvApiClient`**: Dùng riêng cho CV APIs
- **`videoCallApiClient`**: Dùng riêng cho Video Call APIs ⭐ NEW

### Video Call Endpoints

Tất cả các endpoint video call giờ sẽ gọi đến `http://localhost:5000`:

```typescript
// Create call
POST http://localhost:5000/api/video/calls
Body: { room_name?: string }

// Join call
POST http://localhost:5000/api/video/calls/:callId/join

// End call
POST http://localhost:5000/api/video/calls/:callId/end

// Get call info
GET http://localhost:5000/api/video/calls/:callId
```

### Authentication

Video Call API client có interceptor riêng để tự động thêm JWT token từ Supabase:

```typescript
Authorization: Bearer<supabase_access_token>;
```

## Backend Requirements

### Cần chạy Video Call server riêng trên port 5000:

```bash
cd jobboost-backend
# Hoặc server video call riêng
PORT=5000 npm run dev
```

### Server phải có:

1. ✅ Video Call routes (`/api/video/calls/*`)
2. ✅ Video Call controller
3. ✅ Video Call model (VideoCall table)
4. ✅ Socket.IO server cho WebRTC signaling
5. ✅ Authentication middleware hỗ trợ Supabase JWT

### CORS Configuration

Server trên port 5000 cần enable CORS cho frontend:

```javascript
// Backend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
```

## Socket.IO Configuration

### Frontend sẽ kết nối Socket.IO từ localhost:5000

Cần cập nhật trong `useChat` hook hoặc tạo connection riêng cho video call signaling.

**Hiện tại**: Socket.IO vẫn kết nối đến `http://14.169.15.9:3003`  
**Cần xem xét**: Có nên tách Socket connection riêng cho video call không?

### Option 1: Giữ nguyên (Recommended)

- Chat messages: Socket.IO → `http://14.169.15.9:3003`
- Video call REST: HTTP → `http://localhost:5000`
- Video call signaling: Sử dụng chung socket hiện tại

### Option 2: Tách riêng

- Tạo socket connection riêng cho video call
- Video signaling → `http://localhost:5000`

## Testing

### Start servers:

```bash
# Terminal 1: Main backend (port 3003)
cd jobboost-backend
npm run dev

# Terminal 2: Video Call backend (port 5000)
cd jobboost-backend
PORT=5000 npm run dev

# Terminal 3: Frontend
cd exe-frontend
npm run dev
```

### Test flow:

1. ✅ Login vào frontend
2. ✅ Vào Messages page
3. ✅ Click "Video Call" button
4. ✅ Kiểm tra Network tab → Request đi đến `localhost:5000`
5. ✅ Call được tạo thành công

### Expected logs:

```
Video Call API Session check: { hasSession: true, ... }
Adding auth token to Video Call API request: /api/video/calls
Video Call API Response successful: /api/video/calls 201
```

## Troubleshooting

### Lỗi: Connection refused

- ✅ Kiểm tra server port 5000 đang chạy
- ✅ Check `netstat -an | findstr 5000`

### Lỗi: CORS

- ✅ Thêm CORS trong backend
- ✅ Verify origin includes `http://localhost:3000`

### Lỗi: 401 Unauthorized

- ✅ Check Supabase token có hợp lệ
- ✅ Backend middleware hỗ trợ Supabase JWT
- ✅ Token được gửi trong header

### Lỗi: 404 Not Found

- ✅ Routes đã được register đúng
- ✅ Endpoint path: `/api/video/calls` (có `/api` prefix)

## Notes

- Video Call API riêng biệt giúp scale và deploy độc lập
- Có thể deploy video server lên cloud riêng (AWS, Azure, etc.)
- Consider load balancing cho video servers
- Monitor bandwidth usage (video call tốn nhiều bandwidth)

---

**Last Updated**: October 25, 2025  
**Status**: ✅ Configured & Ready
