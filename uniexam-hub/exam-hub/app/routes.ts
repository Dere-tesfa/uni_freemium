import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
    layout('components/layout/main.tsx', [
        index('routes/home.tsx'),
        route('exams', 'routes/exams.tsx'),
        route('exams/:id', 'routes/exams.$id.tsx'),
        route('exams/:id/preview', 'routes/exams.$id.preview.tsx'),
        route('exams/:id/checkout', 'routes/exams.$id.checkout.tsx'),
        route('exams/:id/checkout/success', 'routes/exams.$id.checkout.success.tsx'),
        route('departments', 'routes/departments.tsx'),
        route('leaderboard', 'routes/leaderboard.tsx'),
    ]),
    // Admin login (no layout)
    route('admin/login', 'routes/admin/login.tsx'),
    // Admin routes with admin layout
    layout('components/layout/admin.tsx', [
        route('admin', 'routes/admin/dashboard.tsx'),
        route('admin/payments', 'routes/admin/payments.tsx'),
        route('admin/sheets', 'routes/admin/sheets.tsx'),
        route('admin/users', 'routes/admin/users.tsx'),
        route('admin/settings', 'routes/admin/settings.tsx'),
    ]),
    route('auth/login', 'routes/auth/login.tsx'),
    route('auth/signup', 'routes/auth/signup.tsx'),
] satisfies RouteConfig;
