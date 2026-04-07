# Admin Dashboard Setup Guide

## 🎯 Complete Backend Architecture

This document explains the complete backend architecture and admin dashboard implementation for UniExam Hub.

## 📦 What Was Created

### 1. Backend Services Layer (7 Services)

All services are in [`app/services/`](./app/services/):

- **[auth.service.ts](./app/services/auth.service.ts)** - Authentication & JWT management
- **[user.service.ts](./app/services/user.service.ts)** - User profiles & management
- **[sheet.service.ts](./app/services/sheet.service.ts)** - Exam sheet operations
- **[question.service.ts](./app/services/question.service.ts)** - Question CRUD & CSV import/export
- **[payment.service.ts](./app/services/payment.service.ts)** - Manual payment verification
- **[settings.service.ts](./app/services/settings.service.ts)** - App configuration
- **[exam.service.ts](./app/services/exam.service.ts)** - Exam operations & leaderboard

### 2. Database Layer

- **[app/lib/db.ts](./app/lib/db.ts)** - Mock database (ready for Prisma migration)
- **[app/lib/types.ts](./app/lib/types.ts)** - Complete TypeScript definitions
- **[app/lib/middleware.ts](./app/lib/middleware.ts)** - Auth helpers & utilities

### 3. Admin Dashboard Pages (6 Pages)

All in [`app/routes/admin/`](./app/routes/admin/):

1. **[login.tsx](./app/routes/admin/login.tsx)** - `/admin/login`
2. **[dashboard.tsx](./app/routes/admin/dashboard.tsx)** - `/admin`
3. **[payments.tsx](./app/routes/admin/payments.tsx)** - `/admin/payments`
4. **[sheets.tsx](./app/routes/admin/sheets.tsx)** - `/admin/sheets`
5. **[users.tsx](./app/routes/admin/users.tsx)** - `/admin/users`
6. **[settings.tsx](./app/routes/admin/settings.tsx)** - `/admin/settings`

### 4. Reusable Admin Components (8 Components)

All in [`app/features/admin/components/`](./app/features/admin/components/):

- **StatCard** - Statistics display cards
- **DataTable** - Generic data table
- **ActionButton** - Form action buttons
- **AlertMessage** - Success/error alerts
- **FilterBar** - Search and filter UI
- **PageHeader** - Page titles with actions
- **StatsGrid** - Statistics grid layout
- **ConfirmDialog** - Confirmation dialogs

## 🚀 How to Access Admin Dashboard

### Step 1: Start the Development Server

```bash
cd uniexam-hub/exam-hub
npm run dev
```

### Step 2: Navigate to Admin Login

Open your browser and go to: `http://localhost:5173/admin/login`

### Step 3: Login with Demo Credentials

- **Phone**: `+251912345678`
- **Password**: `admin123`

**Note**: An admin user is automatically created when the app starts via [`app/lib/seed-admin.ts`](./app/lib/seed-admin.ts)

### Step 4: Access Admin Pages

After login, you can access:

- `/admin` - Dashboard
- `/admin/payments` - Payment verification
- `/admin/sheets` - Sheet management
- `/admin/users` - User management
- `/admin/settings` - Configuration

## 📊 Admin Dashboard Features

### Dashboard (`/admin`)

- **Statistics Cards**: Total users, revenue, pending payments, sheets
- **Recent Activity**: Last 10 payment actions
- **Pending Payments**: Top 5 awaiting verification
- **Popular Sheets**: Most purchased sheets
- **Payment Stats**: Approval rate, avg time, avg payment

### Payments (`/admin/payments`)

- **Verification Queue**: All payment requests
- **Filter Tabs**: Pending, Approved, Rejected, All
- **Actions**: Approve, Reject (with reason), Bulk approve
- **Screenshot Viewing**: Click to view payment proof
- **Statistics**: Total requests, approval rate, revenue

### Sheets (`/admin/sheets`)

- **Sheet List**: All exam sheets with status
- **Create New**: Modal form for new sheets
- **Actions**: Edit, Publish/Unpublish, Duplicate, Delete
- **Filters**: Search, department, published status
- **Statistics**: Total, published, unpublished, free

### Users (`/admin/users`)

- **User List**: All registered users with roles
- **Search**: By phone or email
- **Actions**: View details, Delete, Grant/Revoke access
- **Statistics**: Total users, students, admins

### Settings (`/admin/settings`)

- **Bank Accounts**: CBE, Awash, Telebirr configuration
- **App Config**: Name, support contacts, maintenance mode
- **Feature Flags**: Dark mode, offline, bookmarks, leaderboard
- **Pricing**: Currency, min/max/default prices
- **Payment Instructions**: Custom text for users
- **Danger Zone**: Reset to defaults

## 🔧 Technical Architecture

### React Router v7 Framework Mode

Each admin page follows this pattern:

```typescript
// Loader: Fetch data on server
export async function loader({ request }) {
  const data = await someService.getData();
  return { data };
}

// Action: Handle form submissions
export async function action({ request }) {
  const formData = await request.formData();
  const result = await someService.doAction(formData);
  return { success: true, result };
}

// Component: Render UI
export default function AdminPage({ loaderData, actionData }) {
  return <div>{/* UI */}</div>;
}
```

### Service Layer Pattern

```typescript
// Import services
import { paymentService, sheetService } from "~/services";

// Use in loaders
const payments = await paymentService.getPendingPayments();

// Use in actions
await paymentService.approvePayment(paymentId);
```

## 🐛 Troubleshooting

### If pages don't load:

1. Check browser console for errors
2. Verify routes in [`app/routes.ts`](./app/routes.ts)
3. Ensure dev server is running
4. Clear browser cache

### If authentication fails:

1. Admin user is auto-created on app start
2. Use exact credentials: `+251912345678` / `admin123`
3. Check [`app/lib/seed-admin.ts`](./app/lib/seed-admin.ts)

### If data doesn't show:

1. Data is in-memory (resets on restart)
2. Check service implementations
3. Verify loader functions are running

## 📝 Next Steps for Production

1. **Replace mock database** with PostgreSQL + Prisma
2. **Implement proper authentication** with sessions/cookies
3. **Add bcrypt** for password hashing
4. **Add jsonwebtoken** for JWT
5. **Integrate AI service** for explanations
6. **Add file upload** for screenshots (AWS S3/Cloudinary)
7. **Add notifications** (email/SMS/Telegram)
8. **Add logging** and monitoring
9. **Set up environment variables**
10. **Add database migrations**

## 📚 Documentation

- **[Services README](./app/services/README.md)** - Complete service documentation
- **[Architecture](../docs/ARCHITECTURE.md)** - System architecture overview
- **[Requirements](../docs/02-Requirement.md)** - Product requirements

## 🎉 Summary

You now have:

- ✅ Complete backend service layer
- ✅ 6 fully functional admin pages
- ✅ 8 reusable UI components
- ✅ Navigation with admin layout
- ✅ Mock database with all operations
- ✅ Type-safe TypeScript throughout

All admin pages are ready to use at `/admin/*` routes!
