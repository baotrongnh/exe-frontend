# Debug Guide - Wallet Page API Integration

## Overview

Trang wallet đã được cập nhật với console logs chi tiết và debug panel để dễ dàng kiểm tra API responses.

## Debug Panel Features

### 1. 🔄 Refresh Transactions

- Gọi lại API `GET /api/wallet/transactions`
- Kiểm tra response structure
- Log chi tiết vào console

### 2. 📊 Test Wallet API

- Gọi trực tiếp API `GET /api/wallet`
- Hiển thị wallet data structure
- Giúp xác định format response từ backend

### 3. 💰 Test Balance API

- Gọi API `GET /api/wallet/balance`
- Kiểm tra balance response format

## Console Logs Structure

### Wallet API (`/api/wallet`)

```javascript
console.log("💰 Wallet API Response:", data);
console.log("💰 Response structure:", {
  hasData: !!data,
  dataKeys: Object.keys(data),
  wallet: data?.wallet,
  data: data?.data,
  rawData: data,
});
```

**Expected formats:**

```json
// Format 1: Nested
{
  "wallet": {
    "id": "uuid",
    "user_id": "uuid",
    "balance": 1000000,
    "currency": "VND",
    "created_at": "2025-10-22T...",
    "updated_at": "2025-10-22T..."
  }
}

// Format 2: Direct
{
  "id": "uuid",
  "user_id": "uuid",
  "balance": 1000000,
  "currency": "VND",
  "created_at": "2025-10-22T...",
  "updated_at": "2025-10-22T..."
}
```

### Transactions API (`/api/wallet/transactions`)

```javascript
console.log("📊 Transactions API Response:", data);
console.log("📊 Response structure:", {
  hasData: !!data,
  dataKeys: Object.keys(data),
  transactions: data?.transactions,
  items: data?.items,
  results: data?.results,
  rawData: data,
});
```

**Expected formats:**

```json
// Format 1: transactions key
{
  "transactions": [...],
  "totalPages": 1,
  "currentPage": 1,
  "total": 10
}

// Format 2: items key
{
  "items": [...],
  "total_pages": 1,
  "page": 1,
  "total": 10
}

// Format 3: results key
{
  "results": [...],
  "pages": 1,
  "current_page": 1,
  "count": 10
}

// Format 4: data key
{
  "data": [...],
  "pagination": {
    "total_pages": 1,
    "page": 1
  }
}
```

### Transaction Object Format

```json
{
  "id": "uuid",
  "wallet_id": "uuid",
  "amount": 100000,
  "transaction_type": "deposit" | "withdraw" | "payment" | "refund",
  "status": "pending" | "completed" | "failed" | "cancelled",
  "description": "Nạp tiền qua QR Code",
  "reference_id": "optional-reference",
  "created_at": "2025-10-22T10:00:00Z",
  "updated_at": "2025-10-22T10:00:00Z"
}
```

## How to Use Debug Panel

### Step 1: Open DevTools

```
Press F12 or Right-click → Inspect
Navigate to Console tab
```

### Step 2: Clear Console

```
Click 🚫 Clear console or press Ctrl+L
```

### Step 3: Test APIs

```
1. Click "🔄 Refresh Transactions"
2. Check console for response structure
3. Look for these logs:
   - 📊 Transactions API Response: {...}
   - 📊 Response structure: {...}
   - ✅ Transactions set: X items
```

### Step 4: Analyze Response

```javascript
// Check if response has transactions
if (data.transactions) {
  // Format 1: data.transactions
  console.log("✅ Using format: data.transactions");
} else if (data.items) {
  // Format 2: data.items
  console.log("✅ Using format: data.items");
} else if (data.results) {
  // Format 3: data.results
  console.log("✅ Using format: data.results");
}
```

## Common Issues & Solutions

### Issue 1: Empty Transactions

**Symptoms:**

- "No transactions found" message
- Console shows empty array

**Check:**

```javascript
console.log("Response:", data);
// Check if data exists
// Check if response format matches expected
```

**Solution:**

- Verify backend returns correct format
- Check if transactions array is nested
- Update code to match backend format:

```javascript
const transactionsList = data?.transactions || data?.items || [];
```

### Issue 2: Wallet Not Loading

**Symptoms:**

- "Create Wallet" button always shows
- Console shows 404 error

**Check:**

```javascript
console.log("Wallet API Response:", data);
// Check response structure
// Check if wallet data is nested
```

**Solution:**

```javascript
const walletData = data?.wallet || data?.data || data;
```

### Issue 3: Wrong Data Structure

**Symptoms:**

- Data exists but UI shows "No data"
- Console shows data but component doesn't render

**Debug:**

```javascript
console.log("Data keys:", Object.keys(data));
console.log("Transaction 0:", data.transactions?.[0]);
console.log("Has transactions:", !!data.transactions);
console.log("Array length:", data.transactions?.length);
```

## Mock Data for Testing

When no real data exists, mock data will be displayed:

### Mock Transactions Preview

- ✅ Shows 3 sample transactions
- ✅ Different types: deposit, payment, pending
- ✅ Different statuses: completed, pending
- ✅ Opacity 60% to distinguish from real data

### Mock Structure

```javascript
{
  id: "mock-1",
  wallet_id: "mock-wallet",
  amount: 500000,
  transaction_type: "deposit",
  status: "completed",
  description: "Nạp tiền qua QR Code",
  created_at: "2025-10-20T10:00:00Z",
  updated_at: "2025-10-20T10:00:00Z"
}
```

## Backend Checklist

### ✅ Wallet API (`GET /api/wallet`)

- [ ] Returns wallet data
- [ ] Includes: id, user_id, balance, currency, created_at, updated_at
- [ ] Returns 404 if wallet doesn't exist
- [ ] Requires authentication

### ✅ Transactions API (`GET /api/wallet/transactions`)

- [ ] Returns array of transactions
- [ ] Supports pagination (page, limit params)
- [ ] Returns totalPages or total_pages
- [ ] Each transaction has all required fields
- [ ] Requires authentication

### ✅ Create Wallet API (`POST /api/wallet/create`)

- [ ] Creates new wallet
- [ ] Returns 201 status
- [ ] Returns created wallet data
- [ ] Prevents duplicate wallets

### ✅ Get Code API (`GET /api/wallet/code`)

- [ ] Returns unique code
- [ ] Code expires after 3 minutes
- [ ] Requires authentication

## Testing Workflow

### 1. Initial Load

```
1. Open /employer/wallet
2. Open DevTools Console (F12)
3. Watch for automatic API calls:
   - 💰 Wallet API Response
   - 📊 Transactions API Response
4. Check response structures
```

### 2. Manual Testing

```
1. Click "📊 Test Wallet API"
2. Check console for response
3. Verify data structure matches expectations
4. Click "🔄 Refresh Transactions"
5. Verify transactions load correctly
```

### 3. Create Wallet (if needed)

```
1. If wallet doesn't exist, click "Create Wallet"
2. Watch console for:
   - 🆕 Create wallet response
   - ✅ Wallet created and set
3. Verify wallet card updates
```

### 4. Test Deposit Flow

```
1. Click "Nạp tiền" button
2. Watch for:
   - API call to /api/wallet/code
   - Navigation to QR page
3. Check URL contains code parameter
```

## Response Format Adapter

The code automatically handles multiple response formats:

```javascript
// Wallet adapter
const walletData = data?.wallet || data?.data || data;

// Transactions adapter
const transactionsList =
  data?.transactions || data?.items || data?.results || data?.data || [];

// Pagination adapter
const total = data?.totalPages || data?.total_pages || data?.pages || 1;
```

## Error Handling

All API calls log detailed error information:

```javascript
console.error("❌ Error fetching transactions:", error);
console.error("❌ Error details:", {
  status: error?.response?.status,
  statusText: error?.response?.statusText,
  data: error?.response?.data,
  message: error?.message,
});
```

## Next Steps After API Testing

1. **Identify Backend Format**

   - Check console logs
   - Note which format backend uses
   - Update frontend code if needed

2. **Remove Debug Panel** (Production)

   - Comment out or remove debug panel
   - Keep console logs for monitoring

3. **Update Types** (if needed)

   - Adjust TypeScript interfaces
   - Match backend response structure

4. **Test All Scenarios**
   - Empty state
   - With data
   - Error states
   - Loading states

---

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Status:** 🔧 Development/Debug Mode
