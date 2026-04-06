import { Link, useLocation } from 'react-router';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { LayoutDashboard, CreditCard, FileText, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const adminNavItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/sheets', label: 'Exam Sheets', icon: FileText },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border sticky top-0 h-screen shrink-0">
                <div className="p-8">
                    <Link to="/admin" className="flex items-center gap-3 group">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                            <span className="text-primary-foreground font-black text-2xl">U</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-foreground block leading-none">
                                UniExam
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                Admin Panel
                            </span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {adminNavItems.map((item) => {
                        const isActive =
                            location.pathname === item.to ||
                            (item.to !== '/admin' && location.pathname.startsWith(item.to));

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out',
                                    isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'size-5 transition-colors',
                                        isActive ? 'text-primary' : 'text-muted-foreground',
                                    )}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4">
                        <p className="text-xs font-semibold text-foreground mb-1">Need help?</p>
                        <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                            Check the documentation for admin guides.
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-[11px] h-8 rounded-lg">
                            View Docs
                        </Button>
                    </div>
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                    >
                        <LogOut className="size-5" />
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Mobile View Container */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-50 h-16 bg-background border-b border-border flex items-center justify-between px-4 shrink-0">
                    <Link to="/admin" className="flex items-center gap-2">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-primary-foreground font-black text-xl">U</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">Admin</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="size-6" />
                    </Button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <aside
                        className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border animate-in slide-in-from-left duration-300 shadow-xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 flex items-center justify-between border-b border-sidebar-border mb-4">
                            <Link
                                to="/admin"
                                className="flex items-center gap-2"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-primary-foreground font-black text-xl">U</span>
                                </div>
                                <span className="text-lg font-bold tracking-tight text-foreground">Admin</span>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                <X className="size-6" />
                            </Button>
                        </div>
                        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                            {adminNavItems.map((item) => {
                                const isActive =
                                    location.pathname === item.to ||
                                    (item.to !== '/admin' && location.pathname.startsWith(item.to));

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                                        )}
                                    >
                                        <item.icon className="size-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-sidebar-border">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-sidebar-accent transition-colors"
                            >
                                <LogOut className="size-5" />
                                Back to Site
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
