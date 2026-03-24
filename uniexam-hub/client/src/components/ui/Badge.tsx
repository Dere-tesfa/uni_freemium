type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const variantMap: Record<BadgeVariant, string> = {
  default: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  danger:  'bg-red-500/15 text-red-400 border border-red-500/30',
  info:    'bg-brand-500/15 text-brand-400 border border-brand-500/30',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const Badge = ({ children, variant = 'default' }: BadgeProps) => (
  <span className={`badge ${variantMap[variant]}`}>{children}</span>
);

export default Badge;
