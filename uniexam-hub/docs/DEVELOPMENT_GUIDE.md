# Development Guide 🛠️

Follow these standards to ensure consistent, high-quality development across the UniExam Hub codebase.

---

## 🏗️ Adding a New Feature

If you are adding a **Leaderboard** feature, follow these steps:

### 1. Define the Schema (Zod)
Define input/output schemas in `app/lib/zod-schemas.ts`.
```typescript
export const leaderboardSchema = z.array(z.object({
  rank: z.number(),
  name: z.string(),
  score: z.number(),
}));
```

### 2. Create the Service (Server-side)
Create logic in `app/services/leaderboard.service.ts`.
```typescript
export class LeaderboardService {
  static async getTopRankings() {
    // DB query goes here
    return await db.student.findMany({ take: 10, orderBy: { score: 'desc' } });
  }
}
```

### 3. Setup the Route & Loader
Define the page and server-side data fetching in `app/routes/leaderboard.tsx`.
```typescript
import { useLoaderData } from "react-router";
import { LeaderboardService } from "../services/leaderboard.service";

export async function loader() {
  const players = await LeaderboardService.getTopRankings();
  return { players };
}

export default function LeaderboardPage() {
  const { players } = useLoaderData<typeof loader>();
  // Render UI using players data
}
```

---

## 📝 Working with Forms

We use **React Hook Form** for client UX and **React Router Actions** for server processing.

### Example Submission Flow:
1.  **Client:** Validate using Zod on the frontend for immediate feedback.
2.  **Submit:** Use `fetcher.Form` or standard `Form` to trigger the Action.
3.  **Action:** Validate on the server before database mutation.

---

## 💾 State Management Strategy

### 1. Global UI State (Zustand)
Use Zustand only for **ephemeral, UI-only** state like:
*   `theme` (dark/light)
*   `isSidebarOpen`
*   `modalType`

### 2. Server State (React Query)
Use React Query for **data that comes from a server** and needs to be cached/invalidated:
*   User data
*   Live search results
*   Interactive dashboards

### 3. Navigation State (React Router)
Use React Router's built-in state management for:
*   Form submission progress (`useNavigation`)
*   Optimistic UI updates
*   Route-based data fetching

---

## 🚀 Pro Tips
*   **No useEffect for Fetching:** Prefer RRv7 Loaders.
*   **Keep Routes Lean:** Move complex UI into `features/` components.
*   **Full-Stack Type Safety:** Always use the generated `+types` for loaders and actions.
