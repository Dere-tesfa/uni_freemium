# UniExam Hub Project Guide 📚

This document explains the folder structure, architecture, and how to add new features to the platform.

---

## 📂 Folder Structure Overview

### 🖥️ Frontend (`/client/src`)

We use a **Feature-based** architecture. Instead of grouping by type (all components in one folder, all hooks in another), we group by **business domain**.

- `/app`: Global setup (Router, React Query Client, Global Context).
- `/layouts`: Shared UI wrappers (Main, Dashboard, Auth).
- `/features`: **Critical Business Logic.** Each folder (e.g., `auth`, `exam`) contains its own:
  - `/api`: Fetching logic (using Axios + React Query).
  - `/components`: Feature-specific UI.
  - `/pages`: Full pages for this feature.
  - `/hooks`: Custom logic specific to this domain.
- `/components/ui`: Atomic, reusable components (Button, Modal, Input).

### ⚙️ Backend (`/server/src`)

We follow the **MVC + Service Layer** pattern for clear separation of concerns.

- `/config`: DB connection and Environment variables.
- `/routes`: Endpoint definitions and routing.
- `/controllers`: Request handling (extracting data, sending responses).
- `/services`: **Business Logic.** This is where the heavy lifting (like AI explanations) happens.
- `/models`: Database schemas (PostgreSQL).
- `/middleware`: Authentication guards, error handlers, and role checks.
- `/validators`: Input validation using `express-validator`.

---

## 🛠️ How to Add a New Feature

If you wanted to add a **"Leaderboard"** feature, follow these steps:

### 1. Backend Setup
1. **Model**: Define the query in `/models`.
2. **Service**: Write the logic to fetch rankings in `/services/leaderboard.service.js`.
3. **Controller**: Handle the request in `/controllers/leaderboard.controller.js`.
4. **Route**: Register the route in `/routes/leaderboard.routes.js` and link it in `/routes/index.js`.

### 2. Frontend Setup
1. **API**: Create `/features/leaderboard/api/leaderboardApi.ts` using React Query.
2. **Component**: Create your UI in `/features/leaderboard/components/RankingTable.tsx`.
3. **Page**: Assemble it in `/features/leaderboard/pages/LeaderboardPage.tsx`.
4. **Router**: Add the new page to `/app/router.tsx`.

---

## 🤖 AI Explanation Logic

When a student finishes an exam:
1. The frontend sends answers to `/api/exams/:id/submit`.
2. The `exam.controller` compares answers against the DB.
3. For ہر wrong answer, the `ai.service` is called.
4. It sends the question and the student's wrong answer to OpenAI.
5. AI returns a human-like explanation of **why** the student was wrong and what the correct concept is.
6. The final result (score + explanations) is saved and shown to the user.

---

## 🗄️ Database Schema (PostgreSQL)

- **Users**: Auth data and roles.
- **Departments**: (e.g., Computer Science, Medicine).
- **Exams**: Metadata like duration, price, and difficulty.
- **Questions**: Linked to exams, includes multiple choices and the correct index.
- **Purchases**: Tracks which user bought which exam.
- **Results**: Records score, time spent, and AI-generated explanations.

---

## 🚀 Pro Tips
- **Always use the `api` layer**: Never use `axios` directly in a React component.
- **Keep components small**: If a component exceeds 100 lines, move logic to a custom hook.
- **Validation**: Validate on both frontend (using Zod) and backend (Express Validator).
