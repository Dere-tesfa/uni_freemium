# UniExam Hub - API Documentation

## Base URL
```
http://localhost:5173
```

## Authentication

### Student Login
```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

email=student@test.com&password=password123
```

**Response:**
```json
{
  "success": true,
  "redirect": "/"
}
```
Set-Cookie header contains session token.

### Student Register
```http
POST /auth/signup
Content-Type: application/x-www-form-urlencoded

phone=+251912345680&email=newuser@test.com&password=password123&firstName=John&lastName=Doe
```

### Admin Login
```http
POST /admin/login
Content-Type: application/x-www-form-urlencoded

phone=+251912345678&password=admin123
```

**Response:** Redirects to `/admin` with session cookie.

---

## Public Routes

### Get All Exams
```http
GET /exams
```
Returns list of published exam sheets.

### Get Exam Detail
```http
GET /exams/:id
```
Returns exam details with purchase status.

### Preview Exam (Auth Required)
```http
GET /exams/:id/preview
```
Returns first 3 questions. Requires purchase approval.

---

## Protected Routes (Require Auth)

### Checkout
```http
GET /exams/:id/checkout
```
Shows payment form. Redirects if already purchased.

### Submit Payment
```http
POST /exams/:id/checkout
Content-Type: multipart/form-data

amount=200&firstName=John&lastName=Doe&email=j@test.com&phone=+251912345680&payment-method=telebirr&transactionId=TN123456&payerPhone=+251912345680
```

---

## Admin Routes

### Dashboard
```http
GET /admin
```
Requires admin auth.

### Payment Management
```http
GET /admin/payments?status=pending
```

### Approve Payment
```http
POST /admin/payments
action=approve&paymentId=<purchase-id>
```

### Reject Payment
```http
POST /admin/payments
action=reject&paymentId=<purchase-id>&reason=Invalid transaction
```

### Create Exam Sheet
```http
POST /admin/sheets
action=create&title=DSA&course_code=CS301&university=Woldia&department=CS&year=2024&examType=mid&semester=1&price=200&description=Data Structures
```

### Toggle Publish
```http
POST /admin/sheets
action=toggle-publish&sheetId=<sheet-id>
```

---

## Error Responses

```json
{
  "error": "Invalid email or password."
}
```

```json
{
  "errors": {
    "general": ["Invalid email or password."]
  }
}
```