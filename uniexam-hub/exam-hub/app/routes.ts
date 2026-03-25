import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/main-layout.tsx", [
    index("routes/home.tsx"),
    route("exams", "routes/exams.tsx"),
    route("departments", "routes/departments.tsx"),
    route("leaderboard", "routes/leaderboard.tsx"),
  ]),
  route("auth/login", "routes/auth/login.tsx"),
  route("auth/signup", "routes/auth/signup.tsx"),
] satisfies RouteConfig;
