# Hệ thống Nạp Tiền Ví - Tài liệu Hướng dẫn

## Tổng quan

Hệ thống nạp tiền cho phép employer nạp tiền vào ví thông qua việc quét mã QR. Quy trình được tự động hóa với kiểm tra thanh toán trong 3 phút.

## Các trang đã tạo

### 1. `/employer/wallet` - Trang Quản lý Ví

- **Chức năng mới**: Thêm button "Nạp tiền" để điều hướng đến trang nạp tiền
- **File**: `src/app/employer/wallet/page.tsx`

### 2. `/employer/wallet/deposit` - Trang Nhập Số Tiền

- **Chức năng**:
  - Form nhập số tiền với validation (tối thiểu 10,000 VND)
  - Các nút chọn nhanh: 50k, 100k, 200k, 500k, 1M, 2M
  - Hiển thị tổng tiền nạp
  - Submit gửi số tiền đến API `/wallet/getCode`
  - Nhận code từ backend và chuyển đến trang QR
- **File**: `src/app/employer/wallet/deposit/page.tsx`

### 3. `/employer/wallet/deposit/qr` - Trang Hiển Thị QR Code

- **Chức năng**:
  - Nhận `amount` và `code` từ URL query params
  - Tạo mã QR sử dụng VietQR API với format: `LENSOR {code}`
  - Đếm ngược thời gian 3 phút
  - Polling API `/payment/{code}` mỗi 5 giây
  - Xử lý các trạng thái:
    - **Success**: Hiển thị thông báo thành công, chuyển về trang ví sau 2s
    - **Failed**: Hiển thị lỗi, cho phép thử lại
    - **Expired**: Hết thời gian 3 phút, chuyển về trang deposit sau 3s
- **File**: `src/app/employer/wallet/deposit/qr/page.tsx`

## API Endpoints

### 1. `POST /api/wallet/getCode`

- **Request**: `{ amount: number }`
- **Response**: `{ code: string }`
- **Mô tả**: Backend tạo mã giao dịch duy nhất

### 2. `GET /api/payment/{code}`

- **Response**: `{ status: "success" | "failed" | "pending", success?: boolean }`
- **Mô tả**: Kiểm tra trạng thái thanh toán
- **Polling**: Được gọi mỗi 5 giây trong tối đa 3 phút

## Utility Functions

### File: `src/lib/qr.ts`

#### `createQRData(bankNumber, amount, code)`

- Tạo chuỗi dữ liệu QR theo format VietQR
- Format: `{bankId}|{bankNumber}|{amount}|LENSOR {code}`

#### `generateQRCodeUrl(bankNumber, amount, code)`

- Tạo URL hình ảnh QR code sử dụng VietQR API
- Trả về URL có thể hiển thị trực tiếp trong `<Image>`

#### `formatVND(amount)`

- Format số tiền theo định dạng VND

## Biến Môi Trường

### `.env.local`

```bash
NEXT_PUBLIC_BANK_NUMBER=1029118580
```

## Quy trình Hoàn chỉnh

1. **User click "Nạp tiền"** → Chuyển đến `/employer/wallet/deposit`

2. **User nhập số tiền** → Click "Tiếp tục"

   - Validate số tiền >= 10,000 VND
   - Gọi API `POST /wallet/getCode` với amount
   - Nhận code từ backend

3. **Chuyển đến trang QR** → `/employer/wallet/deposit/qr?amount={amount}&code={code}`

   - Tạo QR code với `generateQRCodeUrl()`
   - Hiển thị QR code
   - Bắt đầu đếm ngược 3 phút
   - Bắt đầu polling mỗi 5 giây

4. **User quét QR và chuyển khoản**

   - Nội dung: `LENSOR {code}`
   - Số tiền: Theo QR code

5. **Hệ thống kiểm tra thanh toán**
   - Polling: `GET /payment/{code}` mỗi 5s
   - Nếu `status === "success"` hoặc `success === true`:
     - Dừng polling
     - Hiển thị thành công
     - Chuyển về `/employer/wallet` sau 2s
   - Nếu hết 3 phút:
     - Dừng polling
     - Hiển thị "Mã QR đã hết hạn"
     - Chuyển về `/employer/wallet/deposit` sau 3s

## Các Component UI Sử dụng

- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`
- `Input`
- `Label`
- `Badge`
- Icons: `Wallet`, `ArrowLeft`, `CheckCircle2`, `XCircle`, `Clock`, `Loader2`, `Plus`, `RefreshCw`

## Lưu ý Kỹ thuật

1. **Suspense Boundary**: Trang QR sử dụng Suspense để xử lý `useSearchParams()` an toàn

2. **Memory Leaks Prevention**: Tất cả intervals được clear trong cleanup function

3. **Environment Variables**: Sử dụng `NEXT_PUBLIC_` prefix để expose cho client-side

4. **Error Handling**:

   - Validation đầu vào
   - Try-catch cho API calls
   - Toast notifications cho user feedback

5. **UX Improvements**:
   - Loading states
   - Countdown timer
   - Auto-redirect sau khi thành công/thất bại
   - Quick amount buttons

## Testing Checklist

- [ ] Nhập số tiền < 10,000 VND → Hiển thị lỗi
- [ ] Nhập số tiền hợp lệ → Navigate đến trang QR
- [ ] QR code hiển thị đúng
- [ ] Countdown timer hoạt động
- [ ] Polling API được gọi mỗi 5 giây
- [ ] Thanh toán thành công → Redirect về wallet
- [ ] Hết 3 phút → Redirect về deposit
- [ ] Button "Quay lại" hoạt động
- [ ] Responsive design trên mobile

## Cấu trúc Thư mục

```
src/
├── app/
│   └── employer/
│       └── wallet/
│           ├── page.tsx (Updated - thêm button Nạp tiền)
│           └── deposit/
│               ├── page.tsx (New - Form nhập số tiền)
│               └── qr/
│                   └── page.tsx (New - Hiển thị QR & polling)
├── lib/
│   ├── api.ts (Updated - thêm getCode, checkPayment)
│   └── qr.ts (New - QR utilities)
└── types/
    └── wallet.ts (Existing)
```
