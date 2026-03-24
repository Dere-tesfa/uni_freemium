import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import DepartmentsPage from '@/features/departments/pages/DepartmentsPage';
import DepartmentDetailPage from '@/features/departments/pages/DepartmentDetailPage';
import ExamPage from '@/features/exam/pages/ExamPage';
import ResultPage from '@/features/exam/pages/ResultPage';
import DashboardHome from '@/features/dashboard/pages/DashboardHome';
import MyExams from '@/features/dashboard/pages/MyExams';
import Purchases from '@/features/dashboard/pages/Purchases';
import LeaderboardPage from '@/features/leaderboard/pages/LeaderboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DepartmentsPage /> },
      { path: 'departments', element: <DepartmentsPage /> },
      { path: 'departments/:id', element: <DepartmentDetailPage /> },
      { path: 'exam/:id', element: <ExamPage /> },
      { path: 'exam/:id/result', element: <ResultPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'my-exams', element: <MyExams /> },
      { path: 'purchases', element: <Purchases /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
]);
