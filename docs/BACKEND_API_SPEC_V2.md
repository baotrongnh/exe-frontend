# Backend API Specification v2 - Simplified Deposit Flow

## Overview

API đã được đơn giản hóa. Không còn yêu cầu amount khi tạo code. User sẽ tự nhập số tiền khi chuyển khoản.

## API Changes

### ❌ OLD: POST /api/wallet/getCode

```javascript
// Request
POST /api/wallet/getCode
Headers: {
  Authorization: Bearer <token>
}
Body: {
  amount: 100000
}

// Response
{
  code: "ABC123",
  amount: 100000
}
```

### ✅ NEW: GET /api/wallet/code

```javascript
// Request
GET /api/wallet/code
Headers: {
  Authorization: Bearer <token>
}
// No body needed

// Response
{
  code: "ABC123"
}
```

## Implementation

### 1. Generate Code Endpoint

```javascript
router.get("/api/wallet/code", authenticate, async (req, res) => {
  const userId = req.user.id;

  // Generate unique code
  const code = generateUniqueCode(); // e.g., "LENSOR-20251022-ABC123"
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

  // Save to database - NO AMOUNT YET
  await PaymentCode.create({
    userId,
    code,
    status: "pending",
    amount: null, // Will be set when payment received
    expiresAt,
    createdAt: new Date(),
  });

  res.json({ code });
});
```

### 2. Check Payment Status (Unchanged)

```javascript
router.get("/api/payment/:code", authenticate, async (req, res) => {
  const { code } = req.params;
  const userId = req.user.id;

  const payment = await PaymentCode.findOne({
    where: { code, userId },
  });

  if (!payment) {
    return res.status(404).json({
      message: "Payment code not found",
    });
  }

  // Check if expired
  if (new Date() > payment.expiresAt && payment.status === "pending") {
    payment.status = "expired";
    await payment.save();
  }

  res.json({
    status: payment.status,
    success: payment.status === "success",
    code: payment.code,
    amount: payment.amount, // Amount from bank transfer
    createdAt: payment.createdAt,
    expiresAt: payment.expiresAt,
    completedAt: payment.completedAt,
  });
});
```

### 3. Bank Webhook Handler (UPDATED)

```javascript
router.post("/api/webhook/bank-transfer", async (req, res) => {
  const {
    transactionId,
    amount, // Amount from bank
    description, // "LENSOR ABC123"
    senderAccount,
    receiverAccount,
    timestamp,
  } = req.body;

  // Validate receiver account
  if (receiverAccount !== process.env.BANK_ACCOUNT) {
    return res.status(400).json({ message: "Invalid receiver account" });
  }

  // Extract code from description: "LENSOR ABC123" -> "ABC123"
  const codeMatch = description.match(/LENSOR\s+([A-Z0-9]+)/i);
  if (!codeMatch) {
    return res.status(400).json({ message: "Invalid description format" });
  }

  const code = codeMatch[1];

  // Find pending payment
  const payment = await PaymentCode.findOne({
    where: { code, status: "pending" },
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment code not valid" });
  }

  // Check if expired
  if (new Date() > payment.expiresAt) {
    payment.status = "expired";
    await payment.save();
    return res.status(410).json({ message: "Payment code expired" });
  }

  // ✅ USE AMOUNT FROM BANK, NOT FROM DATABASE
  const amountReceived = amount;

  // Update payment with actual amount
  payment.status = "success";
  payment.amount = amountReceived; // Save actual amount
  payment.transactionId = transactionId;
  payment.completedAt = new Date();
  await payment.save();

  // Add to user wallet with actual amount
  await addToWallet(payment.userId, amountReceived, payment.id);

  res.json({
    success: true,
    amount: amountReceived,
  });
});

// Helper function
async function addToWallet(userId, amount, paymentCodeId) {
  // Get or create wallet
  let wallet = await Wallet.findOne({ where: { userId } });
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
      currency: "VND",
    });
  }

  // Add amount to balance
  wallet.balance += amount;
  await wallet.save();

  // Create transaction record
  await WalletTransaction.create({
    walletId: wallet.id,
    paymentCodeId,
    amount,
    transactionType: "deposit",
    status: "completed",
    description: `Nạp tiền qua QR code`,
    referenceId: paymentCodeId,
    createdAt: new Date(),
  });

  return wallet;
}
```

## Database Schema Updates

### Payment Codes Table

```sql
CREATE TABLE payment_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  code VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NULL, -- ✅ NOW NULLABLE - Set when payment received
  status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_status (status),
  INDEX idx_expires (expires_at)
);
```

## Key Changes

| Aspect             | Old                  | New                       |
| ------------------ | -------------------- | ------------------------- |
| **Endpoint**       | POST /wallet/getCode | GET /wallet/code          |
| **Request Body**   | { amount: 100000 }   | (empty)                   |
| **Response**       | { code, amount }     | { code }                  |
| **Amount Storage** | Set on code creation | Set when payment received |
| **Amount Source**  | Frontend input       | Bank webhook              |
| **Flexibility**    | Fixed amount         | Any amount                |

## Benefits

1. **User Flexibility**: User có thể nạp bất kỳ số tiền nào
2. **Simpler Flow**: Giảm 1 bước (nhập số tiền)
3. **More Accurate**: Amount từ bank 100% chính xác
4. **Better UX**: Nhanh hơn, ít bước hơn

## Testing

### Test 1: Basic Flow

```bash
# 1. Generate code
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3003/api/wallet/code

# Response: { "code": "ABC123" }

# 2. Simulate bank webhook
curl -X POST http://localhost:3003/api/webhook/bank-transfer \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "BANK123",
    "amount": 50000,
    "description": "LENSOR ABC123",
    "receiverAccount": "1029118580",
    "timestamp": "2025-10-22T10:00:00Z"
  }'

# 3. Check status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3003/api/payment/ABC123

# Response:
# {
#   "status": "success",
#   "success": true,
#   "amount": 50000,
#   "code": "ABC123"
# }
```

### Test 2: Different Amounts

```bash
# User A: Nạp 100,000
# User B: Nạp 500,000
# Both should work with their respective amounts
```

### Test 3: Expired Code

```bash
# Wait 3 minutes
# Check status -> should return "expired"
```

## Security Considerations

1. **Webhook Validation**: Verify webhook signature from bank
2. **Amount Validation**:
   - Min: 10,000 VND (optional)
   - Max: 50,000,000 VND (optional)
3. **Rate Limiting**: Max 5 code generations per hour per user
4. **Code Expiration**: Auto-expire after 3 minutes
5. **Duplicate Prevention**: Check if transaction_id already processed

## Example Code Generation

```javascript
function generateUniqueCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}${random}`;
}

// Example outputs:
// "L7K9M2N3P4"
// "M8N4P5Q6R7"
// "N9P5Q6R7S8"
```

## Monitoring & Logging

```javascript
// Log code generation
console.log("[WALLET] Code generated:", {
  userId,
  code,
  expiresAt: expiresAt.toISOString(),
});

// Log payment received
console.log("[WALLET] Payment received:", {
  code,
  amount,
  transactionId,
  userId,
});

// Log expiration
console.log("[WALLET] Code expired:", {
  code,
  userId,
});
```

## Error Handling

```javascript
// Handle duplicate transaction
if (await PaymentCode.findOne({ where: { transactionId } })) {
  return res.status(409).json({
    message: "Transaction already processed",
  });
}

// Handle invalid amount
if (amount < 10000) {
  return res.status(400).json({
    message: "Amount too low. Minimum: 10,000 VND",
  });
}

// Handle missing description
if (!description || !description.includes("LENSOR")) {
  return res.status(400).json({
    message: "Invalid transfer description",
  });
}
```

---

**Version:** 2.0  
**Last Updated:** October 22, 2025  
**Breaking Changes:** Yes - API signature changed
