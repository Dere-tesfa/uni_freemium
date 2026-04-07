# Backend Services Documentation

This directory contains all server-side services for the UniExam Hub application, following the React Router v7 Framework Mode architecture.

## 📁 Service Layer Structure

```
services/
├── auth.service.ts       # Authentication & JWT management
├── user.service.ts       # User management & profiles
├── sheet.service.ts      # Exam sheet CRUD operations
├── question.service.ts   # Question management & CSV import/export
├── payment.service.ts    # Manual payment verification system
├── settings.service.ts   # Admin configuration & feature flags
├── exam.service.ts       # Exam operations & AI explanations
└── index.ts             # Centralized exports
```

## 🔐 Authentication Service

**File:** [`auth.service.ts`](./auth.service.ts)

Handles user authentication, JWT token management, and password operations.

### Key Features:

- Phone-based registration (Ethiopian format: `+251XXXXXXXXX`)
- JWT token generation and verification
- Password hashing and verification
- Role-based access control (student/admin)

### Usage Example:

```typescript
import { authService } from "~/services";

// In a loader or action
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  try {
    const { user, token } = await authService.login({ phone, password });
    // Store token in session/cookie
    return { user, token };
  } catch (error) {
    return { error: error.message };
  }
}
```

## 👤 User Service

**File:** [`user.service.ts`](./user.service.ts)

Manages user profiles, statistics, bookmarks, and progress tracking.

### Key Features:

- User profile management
- Purchase history
- Bookmarks for questions
- Progress tracking per sheet
- Answer recording with instant feedback

### Usage Example:

```typescript
import { userService } from "~/services";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const profile = await userService.getUserProfile(user.id);
  return profile;
}
```

## 📄 Sheet Service

**File:** [`sheet.service.ts`](./sheet.service.ts)

Handles exam sheet management, access control, and sheet operations.

### Key Features:

- CRUD operations for sheets
- Access control (free vs paid)
- Popular sheets & new arrivals
- Search and filtering
- Sheet duplication

### Usage Example:

```typescript
import { sheetService } from "~/services";

export async function loader({ params, request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  const sheet = await sheetService.getSheetWithAccess(params.id, userId);

  if (!sheet) {
    throw new Response("Sheet not found", { status: 404 });
  }

  return sheet;
}
```

## ❓ Question Service

**File:** [`question.service.ts`](./question.service.ts)

Manages questions, including bulk operations and CSV import/export.

### Key Features:

- Question CRUD operations
- Bulk question creation
- CSV import/export
- Question reordering
- Question statistics

### CSV Format:

```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,lesson_content
"What is 2+2?","3","4","5","6","B","2+2 equals 4","Basic arithmetic"
```

### Usage Example:

```typescript
import { questionService } from "~/services";

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const csvFile = formData.get("csv") as File;
  const csvText = await csvFile.text();
  const sheetId = formData.get("sheetId") as string;

  const questions = await questionService.importQuestionsFromCSV(
    sheetId,
    csvText,
  );
  return { success: true, count: questions.length };
}
```

## 💳 Payment Service

**File:** [`payment.service.ts`](./payment.service.ts)

Implements the manual payment verification system for Ethiopian context.

### Key Features:

- Payment request creation
- Screenshot upload handling
- Admin approval/rejection workflow
- Payment history tracking
- Bulk approval operations
- Payment statistics

### Payment Flow:

1. **Student:** Creates payment request with screenshot
2. **System:** Status set to "pending"
3. **Admin:** Reviews screenshot and bank account
4. **Admin:** Approves or rejects with reason
5. **System:** Grants access or notifies rejection
6. **Student:** Receives notification

### Usage Example:

```typescript
import { paymentService } from "~/services";

// Student creates payment request
export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const data = await getJsonBody(request);

  const payment = await paymentService.createPaymentRequest({
    user_id: user.id,
    sheet_id: data.sheetId,
    screenshot_url: data.screenshotUrl,
    amount: data.amount,
  });

  return { payment };
}

// Admin approves payment
export async function action({ request, params }: Route.ActionArgs) {
  await requireAdmin(request);
  const payment = await paymentService.approvePayment(params.paymentId);
  return { payment };
}
```

## ⚙️ Settings Service

**File:** [`settings.service.ts`](./settings.service.ts)

Manages application configuration, bank accounts, and feature flags.

### Key Features:

- Bank account management
- Payment instructions
- App configuration
- Feature flags
- Settings import/export

### Usage Example:

```typescript
import { settingsService } from "~/services";

export async function loader() {
  const bankAccounts = await settingsService.getBankAccounts();
  const instructions = await settingsService.getPaymentInstructions();
  const features = await settingsService.getFeatureFlags();

  return { bankAccounts, instructions, features };
}
```

## 📝 Exam Service

**File:** [`exam.service.ts`](./exam.service.ts)

Handles exam operations, answer submission, and AI explanations.

### Key Features:

- Exam listing with filters
- Answer submission (single or bulk)
- Progress tracking
- Leaderboard generation
- AI-powered explanations (placeholder for integration)

### Usage Example:

```typescript
import { examService } from "~/services";

// Submit single answer
export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const { questionId, answer } = await getJsonBody(request);

  const result = await examService.submitAnswer(user.id, questionId, answer);
  return result;
}

// Submit entire exam
export async function action({ request, params }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const { answers } = await getJsonBody(request);

  const result = await examService.submitExam(user.id, params.sheetId, answers);
  return result;
}
```

## 🛠️ Middleware Utilities

**File:** [`../lib/middleware.ts`](../lib/middleware.ts)

Helper functions for authentication, validation, and response handling in loaders and actions.

### Available Helpers:

```typescript
import {
  requireAuth, // Require authenticated user
  requireAdmin, // Require admin role
  getAuthUser, // Get user (optional)
  getUserId, // Get user ID
  getJsonBody, // Parse JSON body
  getFormData, // Parse form data
  jsonResponse, // Create JSON response
  errorResponse, // Create error response
  validateRequired, // Validate required fields
  getPaginationParams, // Get pagination from query
  checkRateLimit, // Simple rate limiting
} from "~/lib/middleware";
```

### Usage in Routes:

```typescript
import { requireAuth, getJsonBody, errorResponse } from "~/lib/middleware";

export async function action({ request }: Route.ActionArgs) {
  try {
    const user = await requireAuth(request);
    const data = await getJsonBody(request);

    // Your logic here

    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error.message);
  }
}
```

## 🗄️ Database Layer

**File:** [`../lib/db.ts`](../lib/db.ts)

Mock database implementation. In production, replace with:

- **Prisma** (recommended for TypeScript)
- **Drizzle ORM**
- **Raw PostgreSQL client**

### Current Implementation:

- In-memory storage (resets on restart)
- Singleton pattern
- Full CRUD operations
- Relationship handling

### Production Migration:

```typescript
// Replace this:
import { db } from "~/lib/db";
const user = await db.findUserById(id);

// With Prisma:
import { prisma } from "~/lib/prisma";
const user = await prisma.user.findUnique({ where: { id } });
```

## 🔒 Security Considerations

### Current Implementation (Development):

- Simple password hashing (placeholder)
- Basic JWT implementation
- In-memory rate limiting

### Production Requirements:

1. **Password Hashing:** Use `bcrypt` or `argon2`

   ```bash
   npm install bcrypt @types/bcrypt
   ```

2. **JWT:** Use `jsonwebtoken`

   ```bash
   npm install jsonwebtoken @types/jsonwebtoken
   ```

3. **Environment Variables:**

   ```env
   JWT_SECRET=your-super-secret-key-change-this
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

4. **Rate Limiting:** Use Redis
   ```bash
   npm install ioredis
   ```

## 📊 Database Schema

See [`../lib/types.ts`](../lib/types.ts) for complete type definitions.

### Core Tables:

- **Users:** Authentication and profiles
- **Sheets:** Exam sheets/papers
- **Questions:** Individual questions with options
- **Purchases:** Payment requests and status
- **Settings:** App configuration
- **UserProgress:** Answer tracking
- **Bookmarks:** Saved questions

## 🚀 Getting Started

### 1. Import Services in Routes:

```typescript
// app/routes/api/auth/login.ts
import { authService } from "~/services";
import { jsonResponse, errorResponse } from "~/lib/middleware";

export async function action({ request }: Route.ActionArgs) {
  try {
    const { phone, password } = await request.json();
    const result = await authService.login({ phone, password });
    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error.message, 401);
  }
}
```

### 2. Use in Loaders:

```typescript
// app/routes/sheets/$id.tsx
import { sheetService } from "~/services";
import { getUserId } from "~/lib/middleware";

export async function loader({ params, request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  const sheet = await sheetService.getSheetWithAccess(params.id, userId);
  return sheet;
}
```

### 3. Protected Routes:

```typescript
// app/routes/admin/dashboard.tsx
import { requireAdmin } from "~/lib/middleware";
import { paymentService } from "~/services";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request); // Throws if not admin
  const stats = await paymentService.getPaymentStats();
  return stats;
}
```

## 🧪 Testing

```typescript
// Example test structure
import { authService } from "~/services";

describe("AuthService", () => {
  it("should register a new user", async () => {
    const result = await authService.register({
      phone: "+251912345678",
      password: "test123",
    });

    expect(result.user.phone).toBe("+251912345678");
    expect(result.token).toBeDefined();
  });
});
```

## 📝 TODO: Production Checklist

- [ ] Replace mock database with PostgreSQL + Prisma
- [ ] Implement proper password hashing (bcrypt)
- [ ] Implement proper JWT (jsonwebtoken)
- [ ] Add Redis for rate limiting
- [ ] Integrate AI service (OpenAI/Anthropic) for explanations
- [ ] Add email/SMS notification service
- [ ] Implement file upload service (AWS S3/Cloudinary)
- [ ] Add logging (Winston/Pino)
- [ ] Add monitoring (Sentry)
- [ ] Implement backup strategy
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables
- [ ] Add database migrations
- [ ] Implement caching strategy (Redis)
- [ ] Add comprehensive error handling
- [ ] Implement audit logging
- [ ] Add data validation (Zod schemas)
- [ ] Set up SSL/TLS
- [ ] Configure CORS properly
- [ ] Add request logging

## 📚 Additional Resources

- [React Router v7 Docs](https://reactrouter.com/en/main)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Ethiopian Phone Format](https://en.wikipedia.org/wiki/Telephone_numbers_in_Ethiopia)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Contributing

When adding new services:

1. Follow the existing service pattern
2. Add TypeScript types in `lib/types.ts`
3. Export from `services/index.ts`
4. Document in this README
5. Add usage examples
6. Consider security implications

---

**Built with ❤️ for Ethiopian Students**
