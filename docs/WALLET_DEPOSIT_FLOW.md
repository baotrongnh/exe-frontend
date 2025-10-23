# Sơ đồ Luồng Nạp Tiền (Deposit Flow)

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         /employer/wallet                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [Wallet Card]                [Button: Nạp tiền]                │   │
│  │  Balance: 100,000 VND           ↓                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ Click "Nạp tiền"
                                     ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    /employer/wallet/deposit                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Số tiền (VND): [__________]                                     │   │
│  │                                                                   │   │
│  │  Quick Select:                                                    │   │
│  │  [50k] [100k] [200k] [500k] [1M] [2M]                           │   │
│  │                                                                   │   │
│  │  Tổng tiền nạp: 100,000 đ                                        │   │
│  │                                                                   │   │
│  │              [Button: Tiếp tục]                                   │   │
│  │                   ↓                                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                        POST /api/wallet/getCode
                        { amount: 100000 }
                                     │
                        Response: { code: "ABC123" }
                                     ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              /employer/wallet/deposit/qr?amount=100000&code=ABC123      │
│  ┌────────────────────────────┬──────────────────────────────────────┐ │
│  │  [QR Code Image]           │  Số tiền: 100,000 đ                 │ │
│  │                             │  Nội dung: LENSOR ABC123             │ │
│  │  [QR 300x300]              │  Trạng thái: Đang chờ...             │ │
│  │                             │  ⏱️ Thời gian: 2:45                  │ │
│  │                             │                                      │ │
│  │                             │  Hướng dẫn:                          │ │
│  │                             │  1. Mở app ngân hàng                 │ │
│  │                             │  2. Quét mã QR                       │ │
│  └────────────────────────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                         ┌───────────┴────────────┐
                         │   Polling Loop (5s)    │
                         │  GET /api/payment/     │
                         │        ABC123          │
                         └───────────┬────────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
             Success             Timeout           Still Pending
          (status: success)      (> 3 min)         (keep polling)
                 │                   │                   │
                 ↓                   ↓                   ↑
         ┌──────────────┐    ┌──────────────┐          │
         │  ✓ Success   │    │  ⏰ Expired  │          │
         │  Screen      │    │  Screen      │    ──────┘
         └──────┬───────┘    └──────┬───────┘    (every 5 seconds)
                │                   │
         (after 2s)           (after 3s)
                │                   │
                ↓                   ↓
    /employer/wallet      /employer/wallet/deposit
```

## State Diagram

```
                    ┌────────────┐
                    │   START    │
                    └─────┬──────┘
                          │
                          ↓
                  ┌───────────────┐
                  │ Input Amount  │ ← User inputs amount
                  └───────┬───────┘
                          │
                          ↓
                  ┌───────────────┐
                  │  Get QR Code  │ ← Call API /wallet/getCode
                  └───────┬───────┘
                          │
                          ↓
          ┌───────────────────────────────┐
          │      Display QR Code           │
          │   Start Timer (3 min)          │
          │   Start Polling (5 sec)        │
          └───────────┬───────────────────┘
                      │
                      ↓
          ┌───────────────────────┐
          │   Check Payment       │ ← Every 5 seconds
          └───────────┬───────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ↓             ↓             ↓
   [SUCCESS]      [FAILED]      [TIMEOUT]
        │             │             │
        ↓             ↓             ↓
  Show Success   Show Error    Show Expired
        │             │             │
        ↓             ↓             ↓
   Redirect      Allow Retry   Redirect
   to Wallet      to Deposit    to Deposit
```

## Technical Flow

```
Frontend                    Backend                    Bank/Payment
   │                           │                           │
   │ 1. Submit Amount          │                           │
   ├──────────────────────────>│                           │
   │                           │                           │
   │ 2. Return Code            │                           │
   │<──────────────────────────┤                           │
   │                           │                           │
   │ 3. Display QR             │                           │
   │                           │                           │
   │                           │    User Scans QR          │
   │                           │<──────────────────────────┤
   │                           │                           │
   │                           │    User Confirms          │
   │                           │<──────────────────────────┤
   │                           │                           │
   │ 4. Poll Status (Loop)     │                           │
   ├──────────────────────────>│                           │
   │                           │                           │
   │ 5. Status: Pending        │                           │
   │<──────────────────────────┤                           │
   │                           │                           │
   │     ... wait 5s ...        │                           │
   │                           │                           │
   │ 6. Poll Status Again      │                           │
   ├──────────────────────────>│                           │
   │                           │                           │
   │ 7. Status: Success ✓      │                           │
   │<──────────────────────────┤                           │
   │                           │                           │
   │ 8. Update UI & Redirect   │                           │
   │                           │                           │
```

## Time Management

```
Time: 0:00 ────────────────────────────────────────────> 3:00
       │                                                    │
       │ ← ← ← ← ← ← ← Polling Every 5s  ← ← ← ← ← ← ←    │
       │                                                    │
   QR Generated                                      QR Expired
   Start Polling                                     Redirect

   If SUCCESS before 3:00 → Stop polling, show success
   If 3:00 reached → Stop polling, show expired
```
