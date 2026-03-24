import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Loader from '@/components/shared/Loader';

const navLinks = [
  { to: '/dashboard', label: '🏠 Overview', end: true },
  { to: '/dashboard/my-exams', label: '📝 My Exams' },
  { to: '/dashboard/purchases', label: '💳 Purchases' },
];

const DashboardLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surface-border bg-surface-card flex-shrink-0">
        <div className="p-6 border-b border-surface-border">
          <span className="text-xl font-bold text-brand-400">UniExam Hub</span>
          <p className="text-xs text-surface-muted mt-1">Student Dashboard</p>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
