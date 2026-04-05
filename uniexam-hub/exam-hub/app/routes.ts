import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
    layout('layouts/main-layout.tsx', [
        index('routes/home.tsx'),
        route('exams', 'routes/exams.tsx'),
        route('departments', 'routes/departments.tsx'),
        route('leaderboard', 'routes/leaderboard.tsx'),
    ]),
    // Admin routes with admin layout
    layout('features/admin/layouts/admin-layout.tsx', [
        route('admin', 'features/admin/pages/admin-dashboard.tsx'),
        route('admin/payments', 'features/admin/pages/admin-payments.tsx'),
        route('admin/sheets', 'features/admin/pages/admin-sheets.tsx'),
        route('admin/users', 'features/admin/pages/admin-users.tsx'),
        route('admin/settings', 'features/admin/pages/admin-settings.tsx'),
    ]),
    route('auth/login', 'routes/auth/login.tsx'),
    route('auth/signup', 'routes/auth/signup.tsx'),
] satisfies RouteConfig;
