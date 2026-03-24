import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const AuthLayout = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-400">UniExam Hub</h1>
          <p className="text-surface-muted text-sm mt-1">University Examination Platform</p>
        </div>
        <div className="glass p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
