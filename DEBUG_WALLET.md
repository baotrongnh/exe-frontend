# Wallet API Integration Debug Guide

## API Configuration

### Base URLs:

- **Main Backend & Wallet API**: `http://14.169.15.9:3003`
- **CV API**: `http://14.169.15.9:3003/api`

### Wallet Endpoints:

1. **Create Wallet**

   - URL: `POST http://14.169.15.9:3003/api/wallet/create`
   - Body: `{ "currency": "VND", "initial_balance": 0 }`
   - Response Status: **201 Created**
   - Response:

   ```json
   {
     "success": true,
     "wallet": {
       "id": "wallet_id",
       "user_id": "user_id",
       "balance": 0,
       "currency": "VND",
       "created_at": "2025-10-21T...",
       "updated_at": "2025-10-21T..."
     }
   }
   ```

2. **Get Wallet**

   - URL: `GET http://14.169.15.9:3003/api/wallet`
   - Response:

   ```json
   {
     "success": true,
     "wallet": {
       "id": "wallet_id",
       "user_id": "user_id",
       "balance": 1000000,
       "currency": "VND",
       "created_at": "2025-10-21T...",
       "updated_at": "2025-10-21T..."
     }
   }
   ```

3. **Get Transactions**
   - URL: `GET http://14.169.15.9:3003/api/wallet/transactions`
   - Query Params: `?page=1&limit=10&type=deposit`
   - Response:
   ```json
   {
     "success": true,
     "transactions": [
       {
         "id": "transaction_id",
         "wallet_id": "wallet_id",
         "amount": 100000,
         "transaction_type": "deposit",
         "status": "completed",
         "description": "Deposit via Bank Transfer",
         "reference_id": "ref_123",
         "created_at": "2025-10-21T...",
         "updated_at": "2025-10-21T..."
       }
     ],
     "page": 1,
     "limit": 10,
     "totalPages": 1,
     "totalTransactions": 1
   }
   ```

## Authentication

All requests require Bearer token from Supabase session:

```
Authorization: Bearer <supabase_access_token>
```

## Testing Steps

1. **Login as Employer** → Get Supabase token
2. **Navigate to** `/employer/wallet`
3. **Check Browser Console** for:

   - "Session check"
   - "API Response successful"
   - Any error messages

4. **Expected Behavior**:
   - If no wallet: Show "Create Wallet" button
   - If wallet exists: Show balance and transactions
   - On create wallet success (201): Show success toast with emoji 🎉
   - Transactions auto-load on page load

## Common Issues

### Issue: 404 Not Found

- Wallet doesn't exist yet
- Solution: Click "Create Wallet" button

### Issue: 401 Unauthorized

- No token or invalid token
- Solution: Re-login

### Issue: CORS Error

- Backend doesn't allow frontend origin
- Solution: Check backend CORS settings

### Issue: Empty Transactions

- No transactions created yet
- Solution: This is normal for new wallets

## API Response Structure

The wallet page expects:

```typescript
interface WalletResponse {
  success: boolean;
  wallet: Wallet;
}

interface TransactionsResponse {
  success: boolean;
  transactions: WalletTransaction[];
  page?: number;
  limit?: number;
  totalPages?: number;
  totalTransactions?: number;
}
```

## Files Modified

1. `src/lib/api.ts` - Uses apiClient (main backend) for all wallet endpoints
2. `src/types/wallet.ts` - TypeScript interfaces
3. `src/components/wallet-card.tsx` - Wallet display component with 201 status handling
4. `src/app/employer/wallet/page.tsx` - Main wallet page with transactions
5. `src/components/employer-sidebar.tsx` - Added Wallet menu item

## Next Steps for Testing

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to `/employer/wallet`
4. Check requests to `14.169.15.9:3003`
5. Verify Authorization header is present
6. Check response data structure
7. When creating wallet, verify status 201 and success toast
