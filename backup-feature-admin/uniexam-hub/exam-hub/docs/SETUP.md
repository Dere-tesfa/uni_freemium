# Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

### 1. Clone and Install
```bash
cd uniexam-hub/exam-hub
npm install
```

### 2. Environment Variables
Create `.env` file in `exam-hub/` directory:

```env
# Database - UPDATE THESE
DATABASE_URL="postgresql://postgres:password@localhost:5432/uniexam_db"

# Session & JWT - CHANGE THESE IN PRODUCTION
SESSION_SECRET="change-this-to-random-string-at-least-32-chars"
JWT_SECRET="change-this-to-another-random-string"

# Optional: TeleBirr API for auto-verification
TELEBIRR_API_KEY=""
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or create migration
npx prisma migrate dev --name init
```

### 4. Start Development Server
```bash
npm run dev
```

Access at: http://localhost:5173

---

## Creating Initial Users

### Admin User (Auto-created)
Visit `/admin/login` - admin is created automatically.
- Phone: `+251912345678`
- Password: `admin123`

### Manual Student User
```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const hash = await bcrypt.hash('password123', 10);

await prisma.user.create({
  data: {
    phone: '+251912345679',
    email: 'student@test.com',
    password_hash: hash,
    role: 'student'
  }
});

console.log('Student created: student@test.com / password123');
"
```

---

## Creating Sample Exams

```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.sheet.create({
  data: {
    title: 'Data Structures & Algorithms',
    course_code: 'CS301',
    university: 'Woldia University',
    department: 'Computer Science',
    year: 2024,
    exam_type: 'mid',
    semester: '1',
    price: 200,
    is_published: true,
    description: 'Complete DSA exam with solutions'
  }
});

console.log('Sample exam created!');
"
```

---

## Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

---

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/uniexam
      - SESSION_SECRET=secret
      - JWT_SECRET=secret
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=uniexam
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
# Build and run
docker-compose up --build
```

---

## Troubleshooting

### Prisma Client Error
```bash
# Regenerate Prisma client
rm -rf node_modules/.prisma
npx prisma generate
```

### Database Connection Error
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Create database: `createdb uniexam_db`

### Auth Errors
- Check SESSION_SECRET is set
- Clear browser cookies
- Restart dev server

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```