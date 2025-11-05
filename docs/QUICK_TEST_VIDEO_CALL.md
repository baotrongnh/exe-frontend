# Quick Test Guide - Video Call Feature

## Chuẩn bị (5 phút)

### Backend

```bash
cd d:\FPT_UNIVERSITY\FALL2025_SEM7\EXE201\jobboost-backend
npm run dev
```

Kiểm tra: Server chạy trên http://14.169.15.9:3003 (hoặc localhost:3003)

### Frontend

```bash
cd d:\FPT_UNIVERSITY\FALL2025_SEM7\EXE201\fe\exe-frontend
npm run dev
```

Kiểm tra: App chạy trên http://localhost:3000

## Test Scenario (10 phút)

### Bước 1: Mở 2 browsers/tabs

- **Tab A**: Login as **Employer** (công ty)
- **Tab B**: Login as **Freelancer** (người tìm việc)

### Bước 2: Tạo conversation (nếu chưa có)

- Employer: Post a job
- Freelancer: Apply to job
- Employer: Navigate to Messages → Select conversation with freelancer

### Bước 3: Test Video Call

#### Từ Employer (Tab A):

1. Mở conversation với freelancer
2. Click nút **"Video Call"** (màu xanh, bên cạnh "View Profile")
3. Màn hình hiện "Calling..." với avatar freelancer
4. Trình duyệt hỏi quyền camera/mic → Click **Allow**

#### Từ Freelancer (Tab B):

5. Modal tự động hiện lên: "Incoming video call..."
6. Thấy tên/avatar của employer
7. Click nút **xanh lá (Accept)** để nhận cuộc gọi
8. Trình duyệt hỏi quyền camera/mic → Click **Allow**

#### Khi connected:

9. **Cả 2 bên** thấy video của nhau
   - Video lớn: người kia
   - Video nhỏ (góc trên phải): chính mình (mirrored)
10. Test controls:
    - Click icon **microphone**: mute/unmute audio
    - Click icon **video**: on/off camera
    - Click icon **phone đỏ**: end call

### Bước 4: Verify

✅ Cả 2 bên thấy "Call Ended"  
✅ Camera/mic indicator tắt (không còn đèn đỏ trên browser tab)  
✅ Modal đóng được bằng nút "Close"  
✅ Quay lại chat bình thường

## Các Trường Hợp Khác

### Test Decline Call

1. Employer call
2. Freelancer click nút **đỏ (Decline)**
3. Employer thấy call ended ngay

### Test Cancel During Ringing

1. Employer call
2. Trước khi Freelancer accept, Employer click nút **phone đỏ**
3. Cả 2 thoát ra chat

## Nếu Gặp Lỗi

### Camera/Mic không hoạt động

- Kiểm tra browser permissions: `chrome://settings/content`
- Đảm bảo không app nào khác đang dùng camera
- Thử browser khác (Chrome/Edge recommended)

### Không nhận được incoming call

- Kiểm tra Socket.IO connected (chấm xanh ở góc Messages header)
- Refresh cả 2 tabs
- Kiểm tra backend console có log "Incoming call"

### Video đen hoặc không hiện

- Mở DevTools (F12) → Console → xem lỗi
- Kiểm tra `localStream` và `remoteStream` có tracks không
- Toggle video off/on thử lại

### Connection Failed

- Check backend running
- Check Socket.IO events trong backend logs
- Có thể cần TURN server cho mạng phức tạp (corporate firewall)

## Expected Console Logs

### Khi call (Employer side):

```
📞 Starting call to <freelancer-id>
📞 Call session created: <call-id>
📞 Call initiated to <freelancer-id>
📤 Sent offer to <freelancer-id>
```

### Khi nhận (Freelancer side):

```
📞 Incoming call from <employer-id>
✅ Call accepted, waiting for offer...
📨 Received offer from <employer-id>
📤 Sent answer to <employer-id>
```

### Khi connected (Both sides):

```
WebRTC connection state: connected
📹 Received remote track: video
📹 Received remote track: audio
```

## Files to Check if Errors

1. **Backend**: `jobboost-backend/src/config/socket.js` - Check WebRTC event handlers
2. **Frontend Hook**: `exe-frontend/src/app/(dashboard)/messages/hooks/useVideoCall.ts`
3. **Frontend Page**: `exe-frontend/src/app/(dashboard)/messages/page.tsx`
4. **Browser Console**: F12 → Console tab

## Success Criteria ✅

- [x] Nút "Video Call" hiển thị trong chat header
- [x] Click nút → modal hiện "Calling..."
- [x] Bên kia nhận incoming call notification
- [x] Accept → video streams kết nối
- [x] Controls (mute/video/end) hoạt động
- [x] End call → cleanup đúng (camera tắt, modal đóng)

---

**Estimated Test Time**: 10-15 phút  
**Requirements**: 2 browsers, camera, microphone  
**Status**: Ready to test!
