# Quick Reference Card - Wallet Deposit Feature

## 🔗 URLs

```
/employer/wallet              → Main wallet page
/employer/wallet/deposit      → Enter deposit amount
/employer/wallet/deposit/qr   → Display QR & verify payment
```

## 🎯 Key Functions

### QR Generation (`src/lib/qr.ts`)

```typescript
createQRData(bankNumber, amount, code); // Create QR data string
generateQRCodeUrl(bankNumber, amount, code); // Get VietQR image URL
formatVND(amount); // Format currency
```

### API Calls (`src/lib/api.ts`)

```typescript
api.wallet.getCode({ amount }); // POST /api/wallet/getCode
api.wallet.checkPayment(code); // GET /api/payment/{code}
```

## ⚙️ Configuration

### Environment Variable

```bash
NEXT_PUBLIC_BANK_NUMBER=1029118580
```

### Constants

```typescript
POLLING_INTERVAL = 5000; // 5 seconds
MAX_DURATION = 180000; // 3 minutes
MIN_AMOUNT = 10000; // 10,000 VND
```

## 📊 Payment Status Flow

```
pending → success ✅ → Redirect to wallet (2s)
pending → expired ⏰ → Redirect to deposit (3s)
pending → failed  ❌ → Show retry option
```

## 🔄 Polling Logic

```typescript
useEffect(() => {
  startPolling(); // Start on mount
  return () => clearInterval(); // Cleanup on unmount
}, []);

// Poll every 5 seconds for max 3 minutes
setInterval(() => checkPaymentStatus(), 5000);
```

## 📝 QR Code Format

```
Bank: 970422 (MB Bank)
Account: 1029118580
Amount: {user_amount}
Description: LENSOR {backend_code}
```

## 🎨 UI States

```typescript
type Status = "pending" | "success" | "failed" | "expired";

pending  → Show QR + Timer + Polling
success  → Show ✓ + Auto-redirect
failed   → Show ✗ + Retry button
expired  → Show ⏰ + Auto-redirect
```

## 🧪 Quick Test

```bash
# 1. Start dev server
npm run dev

# 2. Navigate
http://localhost:3000/employer/wallet

# 3. Click "Nạp tiền"
# 4. Enter amount: 100000
# 5. Submit
# 6. See QR code
# 7. Check console for polling logs
```

## 🐛 Debugging Checklist

- [ ] Check console for API errors
- [ ] Verify `.env.local` has `NEXT_PUBLIC_BANK_NUMBER`
- [ ] Check Network tab for API calls
- [ ] Verify backend returns correct format
- [ ] Check intervals are cleared (no memory leaks)
- [ ] Test timeout scenario (wait 3 min)

## 📱 Mobile Testing

```
- iPhone: Safari, Chrome
- Android: Chrome, Samsung Internet
- Tablet: iPad, Android tablet
```

## ⚡ Performance Tips

```typescript
// Use Suspense for searchParams
<Suspense fallback={<Loading />}>
  <QRContent />
</Suspense>;

// Clean up intervals
useEffect(() => {
  return () => {
    clearInterval(pollingInterval);
    clearInterval(timerInterval);
  };
}, []);

// Optimize images
<Image priority />; // For QR code
```

## 🎯 Common Issues & Solutions

| Issue                   | Solution                           |
| ----------------------- | ---------------------------------- |
| QR not loading          | Check VietQR API availability      |
| Polling not working     | Check API endpoint and auth        |
| Timer not counting      | Check useEffect dependencies       |
| Redirect not working    | Check router.push() implementation |
| Amount validation fails | Check MIN_AMOUNT constant          |

## 📚 Related Files

```
src/
├── app/employer/wallet/
│   ├── page.tsx                 [Modified]
│   └── deposit/
│       ├── page.tsx             [New]
│       └── qr/page.tsx          [New]
├── lib/
│   ├── api.ts                   [Modified]
│   └── qr.ts                    [New]
└── types/
    └── wallet.ts                [Existing]

docs/
├── WALLET_DEPOSIT.md
├── WALLET_DEPOSIT_FLOW.md
├── BACKEND_API_SPEC.md
└── IMPLEMENTATION_SUMMARY.md
```

---

**Last Updated:** October 22, 2025  
**Feature Status:** ✅ Production Ready
