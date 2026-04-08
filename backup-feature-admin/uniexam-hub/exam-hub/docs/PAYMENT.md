# Payment Flow - TeleBirr Integration

## Overview

The payment system uses a manual verification flow where users submit their TeleBirr transaction details, and admins verify and approve/reject payments.

## Payment Methods

1. **TeleBirr** - Requires transaction ID and payer phone
2. **CBE Birr** - Requires screenshot upload (legacy)
3. **Card** - Mock implementation (for future Stripe/Chapa integration)

---

## User Flow

### 1. Browse Exams
```
GET /exams
```
User sees list of published exams with prices.

### 2. View Exam Details
```
GET /exams/:id
```
- If not purchased: Shows "Purchase Access" button
- If purchased + approved: Shows "View Exam" button
- If pending: Shows "Payment Under Review" message

### 3. Initiate Checkout (Requires Login)
```
GET /exams/:id/checkout
```
If not logged in, redirects to:
```
/auth/login?redirect=/exams/:id/checkout
```

### 4. Submit Payment
```
POST /exams/:id/checkout
```

**TeleBirr Fields:**
- `payment-method` = "telebirr"
- `transactionId` = TeleBirr transaction reference (e.g., "CE626EJRNS")
- `payerPhone` = Phone number used for payment (e.g., "+251912345679")

**CBE Fields:**
- `payment-method` = "cbebirr"
- `screenshot` = Image file upload

### 5. Confirmation
On success, redirects to:
```
/exams/:id/checkout/success
```

---

## Admin Flow

### 1. View Pending Payments
```
GET /admin/payments?status=pending
```

Shows all pending payments with:
- User email/phone
- Exam title
- Amount
- Transaction ID (TeleBirr)
- Payer phone
- Screenshot (if CBE)

### 2. Approve Payment
```
POST /admin/payments
action=approve&paymentId=<purchase-id>
```

- Updates purchase status to 'approved'
- Sets approved_at timestamp
- User now has access to exam

### 3. Reject Payment
```
POST /admin/payments
action=reject&paymentId=<purchase-id>&reason=<reason>
```

- Updates purchase status to 'rejected'
- Sets rejection_reason
- Sets rejected_at timestamp

---

## Access Control

### Checking User Access
```typescript
// sheet.service.ts - getSheetWithAccess()
const hasAccess = await db.checkUserAccess(userId, sheetId);
```

```typescript
// db.ts - checkUserAccess()
const count = await prisma.purchase.count({
  where: { user_id: userId, sheet_id: sheetId, status: 'approved' }
});
return count > 0;
```

### Route Protection
```typescript
// exams.$id.preview.tsx - loader
if (!exam.has_access) {
  if (user) return redirect(`/exams/${params.id}`);
  return redirect(`/auth/login?redirect=/exams/${params.id}/preview`);
}
```

---

## TeleBirr API (Future Enhancement)

To integrate automatic verification:

```typescript
// Verify transaction
const response = await fetch('https://api.telebirr.com/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.TELEBIRR_API_KEY
  },
  body: JSON.stringify({ reference: transactionId })
});

const data = await response.json();
// Check data.transactionStatus === 'Completed'
// Auto-approve if verified
```

---

## Payment Status States

| Status | Description | User Access |
|--------|-------------|-------------|
| pending | Awaiting admin review | No |
| approved | Payment verified | Yes |
| rejected | Payment invalid | No |

---

## Error Handling

### Common Errors

1. **Already purchased**
   ```json
   {"error": "You already have access to this sheet"}
   ```

2. **Pending request exists**
   ```json
   {"error": "You already have a pending payment request for this sheet"}
   ```

3. **Amount mismatch**
   ```json
   {"error": "Payment amount (200 ETB) does not match sheet price (200 ETB)"}
   ```

4. **Missing transaction ID (TeleBirr)**
   ```json
   {"error": "Please enter your TeleBirr transaction ID"}
   ```

5. **Missing screenshot (CBE)**
   ```json
   {"error": "Please upload a payment screenshot for manual verification."}
   ```