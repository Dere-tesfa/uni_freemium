# Architecture Overview 🏗️

UniExam Hub follows a unified full-stack architecture powered by **React Router v7 (Framework Mode)**.

## 🚀 Key Concepts

### 1. Unified Full-stack
Unlike traditional decoupled (Frontend SPA + Backend REST) apps, we use a **Single-Project** structure where server-side logic (Loaders and Actions) lives alongside the UI components. This eliminates API glue-code and provides a seamless developer experience.

### 2. Feature-based Directory Structure
To maintain scalability, code is grouped by **Business Domain** rather than technical type.

📂 **Structure Example (`/app/features/exam/`):**
*   `api/`: Client-side React Query hooks (for interactive features like instant search).
*   `components/`: Domain-specific components (`ExamCard`, `Timer`).
*   `hooks/`: Domain-specific logic (`useExamTimer`).
*   `pages/`: Full pages built using these components.

### 3. Data Loading (Server-side Loaders)
Loaders run on the server before the page renders, fetching initial data (e.g., from a database or an external API). This results in faster first-page loads and improved SEO.

### 4. Form Mutations (Server-side Actions)
Actions handle form submissions and data updates on the server. They provide automatic re-validation, ensuring the UI stays in sync with the data.

---

## 📁 Directory Breakdown (`/app`)

| Folder | Responsibility |
| :--- | :--- |
| `features/` | Core business logic domains. |
| `layouts/` | Shared UI wrappers (Main, Dashboard, Auth). |
| `routes/` | Page routing definitions. |
| `components/ui/` | Atomic, reusable UI components (Buttons, Inputs, etc.). |
| `services/` | Server-only logic (DB queries, AI logic). |
| `lib/` | Shared utilities, Axios instance, Zod schemas. |
| `store/` | Zustand stores for UI/ephemeral state. |

---

## 🤖 The Bridge: Loaders & Actions

*   **Loaders:** Used for **Read** operations.
*   **Actions:** Used for **Create, Update, Delete** (CUD) operations.

By keeping these together in the `routes/` files, we gain full-stack type safety using React Router's generated `Route` types.
