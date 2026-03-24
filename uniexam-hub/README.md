# UniExam Hub 🎓

A scalable, production-ready full-stack university examination platform.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, React Router v7, TailwindCSS, React Query |
| Backend    | Node.js, Express                    |
| Database   | PostgreSQL                          |
| Auth       | JWT (JSON Web Tokens)               |
| Payments   | Stripe                              |
| AI         | OpenAI API                          |
| DevOps     | Docker, Docker Compose              |

## Quick Start

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### 1. Clone and Setup

```bash
git clone <repo-url> uniexam-hub
cd uniexam-hub
cp .env.example .env
# Fill in your .env values
```

### 2. Run with Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 3. Run Locally (Without Docker)

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

### 4. Seed the Database

```bash
cd server
npm run seed
```

## Project Structure

```
uniexam-hub/
├── client/               # React frontend
├── server/               # Node.js + Express backend
├── docs/                 # Documentation
├── scripts/              # Dev utility scripts
├── docker-compose.yml
├── .env
└── README.md
```

## API Endpoints

| Method | Endpoint                   | Description              | Auth |
|--------|----------------------------|--------------------------|------|
| POST   | /api/auth/register         | Register new user        | ❌   |
| POST   | /api/auth/login            | Login user               | ❌   |
| GET    | /api/departments           | List departments         | ✅   |
| GET    | /api/departments/:id       | Department detail        | ✅   |
| GET    | /api/exams                 | List exams               | ✅   |
| GET    | /api/exams/:id             | Exam detail              | ✅   |
| POST   | /api/exams/:id/submit      | Submit exam answers      | ✅   |
| GET    | /api/dashboard/my-exams    | User's exam history      | ✅   |
| POST   | /api/payments/checkout     | Create payment session   | ✅   |
| GET    | /api/leaderboard           | Global leaderboard       | ✅   |

## Architecture Principles

- **Feature-based** frontend structure — each feature is self-contained
- **MVC + Service Layer** backend — clean separation of concerns
- **API abstraction layer** via React Query — no raw fetches in components
- **Role-based access control** — `admin`, `student` roles
- **AI-powered explanations** — wrong answers get AI explanations

## License

MIT
