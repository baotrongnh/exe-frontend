# Hệ thống Nạp Tiền Ví - Tài liệu Cập nhật (v2)

## Tổng quan

Hệ thống nạp tiền đã được đơn giản hóa. User chỉ cần click "Nạp tiền", hệ thống sẽ tạo mã QR tự động mà không cần nhập số tiền.

## Luồng hoạt động đơn giản

### Quy trình mới:

1. **User click "Nạp tiền"** trên trang `/employer/wallet`
2. **Frontend gọi API** `GET /api/wallet/code` để lấy code
3. **Chuyển đến trang QR** với code: `/employer/wallet/deposit/qr?code={code}`
4. **Hiển thị QR code** không có số tiền, chỉ có nội dung: `LENSOR {code}`
5. **User quét QR và nhập số tiền** tùy ý khi chuyển khoản
6. **Polling kiểm tra** thanh toán mỗi 5 giây trong 3 phút
7. **Thành công** → Redirect về `/employer/wallet`

## API Endpoints

### 1. `GET /api/wallet/code`

- **Request**: Không cần body
- **Response**:

```json
{
  "code": "ABC123XYZ"
}
```

- **Mô tả**: Backend tạo mã giao dịch duy nhất

### 2. `GET /api/payment/{code}`

- **Response**:

```json
{
  "status": "success" | "failed" | "pending",
  "success": true | false,
  "amount": 100000 // số tiền user chuyển
}
```

- **Mô tả**: Kiểm tra trạng thái thanh toán
- **Polling**: Được gọi mỗi 5 giây trong tối đa 3 phút

## QR Code Format (VietQR)

### URL Format:

```
https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NO}-{TEMPLATE}.png?addInfo={DESCRIPTION}&accountName={ACCOUNT_NAME}
```

### Ví dụ:

```
https://img.vietqr.io/image/970422-1029118580-compact2.png?addInfo=LENSOR%20ABC123&accountName=LENSOR
```

### Parameters:

- **BANK_ID**: `970422` (MB Bank)
- **ACCOUNT_NO**: `1029118580` (từ env)
- **TEMPLATE**: `compact2` (540x640, bao gồm QR, logos, thông tin)
- **addInfo**: `LENSOR {code}` (nội dung chuyển khoản)
- **accountName**: `LENSOR` (tên người thụ hưởng)
- **amount**: Không dùng - User tự nhập khi chuyển khoản

## Files đã thay đổi

### 1. `src/lib/qr.ts`

**Đã sửa:**

- `createQRData(bankNumber, code)` - Bỏ tham số amount
- `generateQRCodeUrl(bankNumber, code, accountName)` - Bỏ amount, sử dụng VietQR Quick Link format

### 2. `src/lib/api.ts`

**Đã sửa:**

- `wallet.getCode()` - Không cần tham số, gọi `GET /api/wallet/code`

### 3. `src/app/employer/wallet/page.tsx`

**Đã sửa:**

- Thêm function `handleDeposit()` - Gọi API getCode và navigate đến QR page
- Button "Nạp tiền" gọi `handleDeposit()` thay vì navigate đến deposit form
- Thêm loading state cho button

### 4. `src/app/employer/wallet/deposit/qr/page.tsx`

**Đã sửa:**

- Chỉ nhận `code` từ query params (bỏ `amount`)
- Bỏ hiển thị số tiền
- Redirect về `/employer/wallet` thay vì `/employer/wallet/deposit`

### 5. Files đã XÓA:

- ❌ `src/app/employer/wallet/deposit/page.tsx` - Không cần trang nhập số tiền nữa

## Cấu trúc mới

```
src/
├── app/
│   └── employer/
│       └── wallet/
│           ├── page.tsx (Updated - gọi API getCode trực tiếp)
│           └── deposit/
│               └── qr/
│                   └── page.tsx (Updated - chỉ cần code)
├── lib/
│   ├── api.ts (Updated - getCode không cần params)
│   └── qr.ts (Updated - generateQRCodeUrl không cần amount)
└── types/
    └── wallet.ts (Existing)
```

## So sánh Luồng Cũ vs Mới

### Luồng CŨ:

```
Wallet Page → Deposit Form (nhập số tiền) → QR Page (với số tiền cố định)
                ↓
          POST /wallet/getCode
          { amount: 100000 }
```

### Luồng MỚI:

```
Wallet Page → QR Page (không có số tiền)
     ↓
GET /wallet/code
(không cần body)
```

## Backend Implementation Notes

### Thay đổi API:

**CŨ:**

```javascript
POST / api / wallet / getCode;
Body: {
  amount: 100000;
}
Response: {
  code: "ABC123";
}
```

**MỚI:**

```javascript
GET /api/wallet/code
Body: (không cần)
Response: { code: "ABC123" }
```

### Xử lý Webhook:

Khi nhận webhook từ bank:

```javascript
// Parse description: "LENSOR ABC123"
const code = extractCodeFromDescription(description);

// Tìm payment code
const payment = await PaymentCode.findOne({ where: { code } });

// LẤY AMOUNT TỪ BANK WEBHOOK, không phải từ database
const amountReceived = bankWebhook.amount;

// Cập nhật payment
payment.status = "success";
payment.amount = amountReceived; // Lưu số tiền thực tế
await payment.save();

// Thêm vào wallet
await addToWallet(payment.userId, amountReceived);
```

## Testing

### Test Case 1: Happy Path

```
1. User click "Nạp tiền"
2. Hiển thị QR code
3. User quét QR, nhập 100,000 VND
4. Chuyển khoản với nội dung: LENSOR ABC123
5. Backend nhận webhook, cập nhật status
6. Frontend poll, nhận status: success
7. Redirect về wallet page
8. Wallet balance +100,000 VND
```

### Test Case 2: Timeout

```
1. User click "Nạp tiền"
2. Hiển thị QR code
3. User không chuyển khoản
4. Đợi 3 phút
5. Hiển thị "Mã QR đã hết hạn"
6. Redirect về wallet page
```

### Test Case 3: Multiple Amounts

```
1. User A: Tạo QR, chuyển 50,000 VND
2. User B: Tạo QR, chuyển 500,000 VND
3. Cả hai đều success với số tiền chính xác
```

## Lưu ý quan trọng

1. **Số tiền linh hoạt**: User có thể chuyển bất kỳ số tiền nào, không bị ràng buộc
2. **Backend validation**: Backend phải lấy amount từ bank webhook, không phải từ request
3. **QR code đơn giản**: Chỉ cần code, không có amount cố định
4. **Timeout vẫn 3 phút**: Code hết hạn sau 3 phút
5. **VietQR format**: Sử dụng Quick Link API của VietQR.io

## Environment Variables

```bash
NEXT_PUBLIC_BANK_NUMBER=1029118580
```

## Next.js Configuration

Thêm vào `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'img.vietqr.io',
      port: '',
      pathname: '/image/**',
    },
  ],
}
```

---

**Version:** 2.0  
**Last Updated:** October 22, 2025  
**Status:** ✅ Production Ready
