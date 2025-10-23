# Backend API Requirements for Wallet Deposit System

## Overview

This document describes the backend API endpoints required for the wallet deposit feature with QR code payment.

## Required Endpoints

### 1. Generate Payment Code

**Endpoint:** `POST /api/wallet/getCode`

**Description:** Generate a unique payment code for a deposit transaction.

**Request Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "amount": 100000
}
```

**Response (Success - 200 OK):**

```json
{
  "code": "ABC123XYZ",
  "amount": 100000,
  "expiresAt": "2025-10-22T15:30:00Z"
}
```

**Response (Error - 400 Bad Request):**

```json
{
  "message": "Invalid amount",
  "error": "Amount must be greater than 10000"
}
```

**Business Logic:**

- Generate a unique code (6-10 characters recommended)
- Store the code with:
  - User ID
  - Amount
  - Status: "pending"
  - Created timestamp
  - Expires timestamp (3 minutes from creation)
- Code should be alphanumeric and easy to read
- Code format suggestion: `LENSOR-{TIMESTAMP}-{RANDOM}`

---

### 2. Check Payment Status

**Endpoint:** `GET /api/payment/{code}`

**Description:** Check the payment status for a specific transaction code.

**Request Headers:**

```
Authorization: Bearer <access_token>
```

**URL Parameters:**

- `code` (string, required): The payment code generated from `/wallet/getCode`

**Response (Payment Pending - 200 OK):**

```json
{
  "status": "pending",
  "code": "ABC123XYZ",
  "amount": 100000,
  "createdAt": "2025-10-22T15:27:00Z",
  "expiresAt": "2025-10-22T15:30:00Z"
}
```

**Response (Payment Success - 200 OK):**

```json
{
  "status": "success",
  "success": true,
  "code": "ABC123XYZ",
  "amount": 100000,
  "transactionId": "TXN123456",
  "completedAt": "2025-10-22T15:28:30Z"
}
```

**Response (Payment Failed - 200 OK):**

```json
{
  "status": "failed",
  "success": false,
  "code": "ABC123XYZ",
  "amount": 100000,
  "reason": "Invalid amount received"
}
```

**Response (Code Not Found - 404 Not Found):**

```json
{
  "message": "Payment code not found or expired",
  "error": "NOT_FOUND"
}
```

**Business Logic:**

- Check if code exists and not expired
- Return current status
- If payment detected:
  - Update status to "success"
  - Add amount to user's wallet
  - Create transaction record
  - Return success response

---

## Payment Verification Flow

### Bank Webhook (Recommended)

If your bank supports webhooks, implement this endpoint:

**Endpoint:** `POST /api/webhook/bank-transfer`

**Request Body (from Bank):**

```json
{
  "transactionId": "BANK_TXN_123",
  "amount": 100000,
  "description": "LENSOR ABC123XYZ",
  "senderAccount": "0123456789",
  "receiverAccount": "1029118580",
  "timestamp": "2025-10-22T15:28:30Z"
}
```

**Processing Logic:**

1. Parse the description to extract the code (e.g., "LENSOR ABC123XYZ" → "ABC123XYZ")
2. Find the pending transaction with this code
3. Verify the amount matches
4. Update transaction status to "success"
5. Add amount to user's wallet
6. Create transaction record

### Manual Polling (Alternative)

If webhooks are not available, implement a background job that:

1. Polls your bank's API every 30-60 seconds
2. Fetches recent transactions
3. Matches transaction descriptions with pending codes
4. Updates payment status accordingly

---

## Database Schema Suggestion

### Table: `payment_codes`

```sql
CREATE TABLE payment_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  code VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed, expired
  transaction_id VARCHAR(100), -- Bank transaction ID
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_status (status),
  INDEX idx_expires (expires_at)
);
```

### Table: `wallet_transactions`

```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  payment_code_id UUID REFERENCES payment_codes(id),
  amount DECIMAL(15,2) NOT NULL,
  transaction_type VARCHAR(20) DEFAULT 'deposit',
  status VARCHAR(20) DEFAULT 'completed',
  description TEXT,
  reference_id VARCHAR(100), -- Bank transaction ID
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_wallet (wallet_id),
  INDEX idx_type (transaction_type)
);
```

---

## Security Considerations

1. **Code Generation:**

   - Use cryptographically secure random generation
   - Ensure uniqueness
   - Include checksum to prevent tampering

2. **Expiration:**

   - Automatically expire codes after 3 minutes
   - Clean up expired codes regularly
   - Reject payment attempts for expired codes

3. **Amount Verification:**

   - Always verify the amount from bank matches the expected amount
   - Reject if amounts don't match exactly

4. **Authentication:**

   - All endpoints require valid JWT token
   - Verify user owns the payment code

5. **Rate Limiting:**
   - Limit code generation: 5 requests per minute per user
   - Limit status checks: 20 requests per minute per user

---

## Frontend Integration Points

### Payment Code Format

The frontend will use the code in this format:

```
Description: LENSOR {CODE}
Example: LENSOR ABC123XYZ
```

### QR Code Content

The QR code will contain:

```
Bank ID: 970422 (MB Bank)
Account: 1029118580
Amount: {user_input_amount}
Description: LENSOR {code_from_backend}
```

### Polling Behavior

- Frontend polls every 5 seconds
- Maximum 36 attempts (3 minutes)
- Stops polling on success, failure, or timeout

---

## Testing Scenarios

### 1. Happy Path

```
1. User submits amount: 100,000 VND
2. Backend returns code: "ABC123"
3. User scans QR and transfers
4. Bank webhook triggers
5. Backend updates status to "success"
6. Frontend receives success on next poll
7. User redirected to wallet page
```

### 2. Timeout Scenario

```
1. User submits amount: 100,000 VND
2. Backend returns code: "XYZ789"
3. User doesn't complete payment
4. Frontend polls for 3 minutes
5. Backend marks code as expired
6. Frontend shows timeout message
7. User redirected back to deposit page
```

### 3. Wrong Amount

```
1. User submits amount: 100,000 VND
2. Backend returns code: "DEF456"
3. User transfers 50,000 VND (wrong amount)
4. Backend rejects the payment
5. Status remains "pending"
6. Eventually times out
```

---

## Error Codes

| Code               | Message                                 | HTTP Status |
| ------------------ | --------------------------------------- | ----------- |
| `INVALID_AMOUNT`   | Amount must be at least 10,000 VND      | 400         |
| `CODE_NOT_FOUND`   | Payment code not found                  | 404         |
| `CODE_EXPIRED`     | Payment code has expired                | 410         |
| `PAYMENT_FAILED`   | Payment processing failed               | 422         |
| `UNAUTHORIZED`     | Invalid or missing authentication token | 401         |
| `WALLET_NOT_FOUND` | User wallet not found                   | 404         |
| `RATE_LIMIT`       | Too many requests                       | 429         |

---

## Example Implementation (Node.js/Express)

```javascript
// Generate Code
router.post("/api/wallet/getCode", authenticate, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (amount < 10000) {
    return res.status(400).json({
      message: "Invalid amount",
      error: "Amount must be at least 10,000 VND",
    });
  }

  // Generate unique code
  const code = generateUniqueCode();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

  // Save to database
  await PaymentCode.create({
    userId,
    code,
    amount,
    status: "pending",
    expiresAt,
  });

  res.json({
    code,
    amount,
    expiresAt,
  });
});

// Check Payment Status
router.get("/api/payment/:code", authenticate, async (req, res) => {
  const { code } = req.params;
  const userId = req.user.id;

  const payment = await PaymentCode.findOne({
    where: { code, userId },
  });

  if (!payment) {
    return res.status(404).json({
      message: "Payment code not found or expired",
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
    amount: payment.amount,
    createdAt: payment.createdAt,
    expiresAt: payment.expiresAt,
    completedAt: payment.completedAt,
  });
});

// Bank Webhook Handler
router.post("/api/webhook/bank-transfer", async (req, res) => {
  const { description, amount, transactionId } = req.body;

  // Extract code from description: "LENSOR ABC123"
  const codeMatch = description.match(/LENSOR\s+([A-Z0-9]+)/i);
  if (!codeMatch) {
    return res.status(400).json({ message: "Invalid description format" });
  }

  const code = codeMatch[1];
  const payment = await PaymentCode.findOne({ where: { code } });

  if (!payment || payment.status !== "pending") {
    return res.status(404).json({ message: "Payment code not valid" });
  }

  // Verify amount matches
  if (payment.amount !== amount) {
    payment.status = "failed";
    await payment.save();
    return res.status(422).json({ message: "Amount mismatch" });
  }

  // Update payment status
  payment.status = "success";
  payment.transactionId = transactionId;
  payment.completedAt = new Date();
  await payment.save();

  // Add to user wallet
  await addToWallet(payment.userId, amount, payment.id);

  res.json({ success: true });
});
```

---

## Contact

For any questions about the API integration, please contact the frontend team.
