# UniExam Hub Project Guide 📚

This document explains the unified full-stack architecture using **React Router v7 Framework Mode**, integrating modern engineering patterns and UI/UX best practices.

---

## 🏗️ Architecture: Unified Full-Stack

We use React Router v7 as a complete framework. Data fetching (Loaders) and data mutations (Actions) happen within the same codebase, often running on the server-side during SSR.

### 📂 Folder Structure (`/app`)

We follow a **Feature-based** architecture, grouping by business domain to ensure scalability.

- `+types/`: Generated types for loaders/actions (internal RRv7).
- `components/ui/`: Atomic, reusable Shadcn-like components (Button, Input, Card).
- `layouts/`: Shared UI wrappers (Main, Auth, Dashboard).
- `lib/`: Shared utilities (utils.ts, axios.ts, zod-schemas.ts).
- `store/`: Global state management using **Zustand**.
- `features/`: **Business Logic Domains.** Each folder (e.g., `auth`, `exam`) contains:
  - `api/`: React Query hooks for client-side interactions.
  - `components/`: Feature-specific UI (e.g., `ExamCard.tsx`).
  - `services/`: Server-side logic (DB queries, AI calls).
  - `hooks/`: Domain-specific hooks.
- `routes/`: Page definitions and entry points.

---

## 🛠️ Modern Tech Stack

- **Framework:** React Router v7 (Framework Mode)
- **Styling:** Tailwind CSS v4 (OKLCH Theme)
- **State Management:** Zustand (Ephemeral/UI state)
- **Data Fetching:** React Query (Server-state caching)
- **Forms:** React Hook Form + Zod (Validation)
- **Icons:** Lucide React
- **Backend/DB:** RRv7 Actions/Loaders + PostgreSQL (via Prisma or Drizzle)

---

## 🤖 Full-Stack Workflow

### 1. Data Loading (Loaders)
Instead of `useEffect` fetching, we use **Loaders**. Data is fetched on the server before the page renders, eliminating "loading spinners" for initial page loads.

### 2. Form Mutations (Actions + React Hook Form)
- We use **React Hook Form** with **Zod** for client-side validation and UX (immediate feedback).
- On submission, we use RRv7 `useFetcher` or standard `Form` to trigger a server-side **Action**.

### 3. AI Explanation Logic
When a student submits an answer:
1. An **Action** is triggered in the `exam.$id.submit` route.
2. The server compares the answer and, if wrong, calls the **AI Service**.
3. The AI result is returned and cached via **React Query** for instant future access.

---

## 🎨 UI/UX Principles
- **Optimistic UI:** Use RRv7 `useNavigation` to show instant feedback before the server responds.
- **Skeleton States:** Use during client-side transitions for a "fast" feel.
- **Micro-interactions:** Smooth hover states and transitions using Tailwind v4.
- **Accessibility:** Ensure all forms have proper labels and ARIA attributes.

---

## 🚀 Development Standard
- **Type Safety:** 100% TypeScript. Use Zod for end-to-end type safety from DB to UI.
- **Performance:** Minimize client-side JS by leveraging server-side loaders.
- **Clean Code:** If a route file exceeds 150 lines, move logic to `features/`.
