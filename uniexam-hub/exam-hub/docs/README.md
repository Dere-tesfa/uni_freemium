# UniExam Hub - Documentation

Welcome to the UniExam Hub developer documentation.

## Documentation Index

| Document | Description |
|----------|-------------|
| [API.md](API.md) | API endpoints and usage |
| [DATABASE.md](DATABASE.md) | Database schema and tables |
| [PAYMENT.md](PAYMENT.md) | Payment flow and TeleBirr integration |
| [SETUP.md](SETUP.md) | Installation and deployment guide |

## Quick Start

1. **Install**: `npm install`
2. **Setup DB**: `npx prisma generate && npx prisma db push`
3. **Run**: `npm run dev`
4. **Login**: 
   - Admin: `/admin/login` → `+251912345678` / `admin123`
   - Student: `/auth/login` → `student@test.com` / `password123`

## Tech Stack

- React Router v7
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- JWT Auth

## Key Features

- Student exam purchase with TeleBirr
- Admin payment verification
- Exam preview for purchased users
- Multiple exam types (mid, final, quiz, assignment)
- Semester filtering

## Project Structure

```
exam-hub/
├── app/
│   ├── routes/     # React Router routes
│   ├── services/   # Business logic
│   ├── lib/        # Database & utilities
│   └── components/ # UI components
├── prisma/         # Database schema
├── docs/           # This documentation
└── README.md       # Main readme
```