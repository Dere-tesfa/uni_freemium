# UniExam Hub - Developer Documentation

## Overview

UniExam Hub is a React Router v7 web application for purchasing and accessing university exam sheets. It includes a student-facing public site and an admin panel for managing exams and payments.

## Tech Stack

- **Frontend**: React + React Router v7 + TypeScript + Tailwind CSS
- **Backend**: React Router loaders/actions (server-side)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT tokens stored in cookies

## Project Structure

```
uniexam-hub/exam-hub/
├── app/
│   ├── components/          # React UI components
│   │   ├── layout/          # Layouts (admin.tsx, main.tsx)
│   │   └── ui/             # Shadcn UI components
│   ├── lib/                 # Core utilities
│   │   ├── db.ts           # Prisma database operations
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── middleware.server.ts  # Auth helpers
│   │   ├── session.server.ts      # Cookie session management
│   │   └── seed-admin.ts          # Admin user creation
│   ├── routes/             # React Router routes
│   │   ├── admin/          # Admin panel routes
│   │   │   ├── login.tsx   # Admin login
│   │   │   ├── dashboard.tsx
│   │   │   ├── payments.tsx   # Payment verification
│   │   │   ├── sheets.tsx     # Exam management
│   │   │   ├── users.tsx
│   │   │   └── settings.tsx
│   │   ├── auth/           # Authentication routes
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── exams.tsx           # Public exam listing
│   │   ├── exams.$id.tsx      # Exam detail page
│   │   ├── exams.$id.checkout.tsx  # Payment checkout
│   │   └── exams.$id.preview.tsx   # Free preview (purchased users)
│   ├── services/           # Business logic
│   │   ├── auth.service.ts    # Login/register
│   │   ├── sheet.service.ts   # Exam management
│   │   ├── payment.service.ts # Payment processing
│   │   └── settings.service.ts
│   └── routes.ts           # Route configuration
├── prisma/
│   └── schema.prisma       # Database schema
└── package.json
```

## Database Schema

### User
- `id`: UUID
- `phone`: String (unique) - Ethiopian format +251XXXXXXXXX
- `email`: String (unique)
- `password_hash`: String (bcrypt)
- `role`: String ('student' | 'admin')
- `created_at`, `updated_at`: DateTime

### Sheet (Exam)
- `id`: UUID
- `title`: String
- `course_code`: String
- `university`: String
- `department`: String
- `year`: Int
- `exam_type`: String ('mid', 'final', 'quiz', 'assignment')
- `semester`: String ('1' or '2')
- `price`: Float
- `is_published`: Boolean
- `description`: String?
- `image_url`: String?
- `created_at`, `updated_at`: DateTime
- `questions`: Question[] (relation)
- `purchases`: Purchase[] (relation)

### Question
- `id`: UUID
- `sheet_id`: UUID (relation)
- `question_text`: Text
- `image_url`: String?
- `options`: JSON [{label: "A", text: "..."}]
- `correct_answer`: String ('A', 'B', 'C', 'D')
- `explanation`: Text
- `lesson_content`: Text
- `order`: Int
- `created_at`, `updated_at`: DateTime

### Purchase
- `id`: UUID
- `user_id`: UUID (relation)
- `sheet_id`: UUID (relation)
- `status`: String ('pending', 'approved', 'rejected')
- `screenshot_url`: String?
- `transaction_id`: String? (TeleBirr transaction ID)
- `payer_phone`: String? (TeleBirr payer phone)
- `amount`: Float
- `rejection_reason`: String?
- `created_at`, `approved_at`, `rejected_at`: DateTime

## Authentication Flow

### Student Login
1. User visits `/auth/login`
2. Enters email/password
3. `auth.service.ts` login() validates credentials
4. JWT token generated and stored in cookie session
5. User redirected to original URL (or home)

### Admin Login
1. Admin visits `/admin/login`
2. Enters phone (+251912345678) and password
3. Same auth service validates, checks role is 'admin'
4. Token stored in cookie session
5. Redirects to `/admin` dashboard

### Protected Routes
- Uses `requireAuth()` middleware for user routes
- Uses `requireAdmin()` middleware for admin routes
- On auth failure, redirects to `/auth/login?redirect=<current-path>`

## Payment Flow (TeleBirr)

### Checkout
1. Student logs in and clicks "Purchase Access"
2. Fills contact info and selects "TeleBirr" payment
3. Enters:
   - Transaction ID (from TeleBirr USSD menu)
   - Payer phone number
4. Creates Purchase record with status='pending'
5. Admin reviews at `/admin/payments`
6. Admin approves/rejects - user gets access

### Access Check
- `sheetService.getSheetWithAccess(sheetId, userId)` returns:
  - `has_access`: true if purchased + approved
  - `purchase`: pending purchase info if exists
- If user has access, they can view `/exams/:id/preview`
- If no access, shows "Purchase Access" button

## Routes

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Home page | No |
| `/exams` | List published exams | No |
| `/exams/:id` | Exam detail with purchase button | No |
| `/exams/:id/preview` | View questions (if purchased) | Yes |
| `/exams/:id/checkout` | Payment checkout | Yes |
| `/auth/login` | Student login | No |
| `/auth/signup` | Student register | No |
| `/admin/login` | Admin login | No |
| `/admin` | Admin dashboard | Yes (admin) |
| `/admin/payments` | Verify payments | Yes (admin) |
| `/admin/sheets` | Manage exams | Yes (admin) |
| `/admin/users` | Manage users | Yes (admin) |

## Running the Project

```bash
cd uniexam-hub/exam-hub

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start dev server
npm run dev
```

## Creating Admin User

The admin user is auto-created when visiting `/admin/login`:
- Phone: `+251912345678`
- Password: `admin123`

Or manually via seed script:
```bash
npx tsx -e "import { seedAdminUser } from './app/lib/seed-admin'; seedAdminUser()"
```

## Creating Test Student

```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const hash = await bcrypt.hash('password123', 10);
await prisma.user.create({
  data: { phone: '+251912345679', email: 'student@test.com', password_hash: hash, role: 'student' }
});
console.log('Created: student@test.com / password123');
"
```

## Environment Variables

Create `.env` file:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/uniexam_db
SESSION_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
TELEBIRR_API_KEY=your-api-key (optional)
```

## Key Files

- `app/routes.ts` - Route configuration
- `app/lib/middleware.server.ts` - Auth middleware
- `app/lib/session.server.ts` - Cookie session
- `app/services/auth.service.ts` - Auth logic
- `app/services/sheet.service.ts` - Exam logic
- `app/services/payment.service.ts` - Payment logic