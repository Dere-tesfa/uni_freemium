import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Users, CreditCard, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Mock data - will be replaced with actual data from loaders
const stats = {
    totalUsers: 1247,
    totalRevenue: 45200,
    pendingPayments: 12,
    totalSheets: 89,
    todayRevenue: 1200,
    thisMonthRevenue: 15400,
};

const recentPayments = [
    { id: 1, user: 'Abebe Kebede', amount: 150, sheet: 'Physics Final 2023', status: 'pending', date: '2024-01-15' },
    { id: 2, user: 'Tigist Haile', amount: 200, sheet: 'Chemistry Midterm', status: 'pending', date: '2024-01-15' },
    { id: 3, user: 'Daniel Tadesse', amount: 100, sheet: 'Math Quiz 5', status: 'approved', date: '2024-01-14' },
    {
        id: 4,
        user: 'Sara Mohammed',
        amount: 250,
        sheet: 'Biology Full Package',
        status: 'approved',
        date: '2024-01-14',
    },
];

const recentUsers = [
    { id: 1, name: 'Abebe Kebede', email: 'abebe@email.com', joined: '2024-01-15' },
    { id: 2, name: 'Tigist Haile', email: 'tigist@email.com', joined: '2024-01-14' },
    { id: 3, name: 'Mikias Yilma', email: 'mikias@email.com', joined: '2024-01-13' },
];

export function meta() {
    return [
        { title: 'Admin Dashboard - UniExam Hub' },
        { name: 'description', content: 'Admin dashboard for managing payments, users, and content' },
    ];
}

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Financial Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-all font-medium text-sm">
                    + Add New Sheet
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, trend: '+12%', trendUp: true },
                    { label: 'Total Revenue', value: `ETB ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+8%', trendUp: true },
                    { label: 'Pending Payments', value: stats.pendingPayments, icon: Clock, trend: 'Requires action', trendUp: false },
                    { label: 'Exam Sheets', value: stats.totalSheets, icon: FileText, trend: `${stats.totalSheets - 12} free`, trendUp: true },
                ].map((stat, i) => (
                    <div 
                        key={i} 
                        className="p-6 bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-primary/10 transition-colors">
                                <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</h3>
                            <p className={cn(
                                "text-xs font-medium flex items-center gap-1 mt-2",
                                stat.trendUp ? "text-green-600" : "text-amber-600"
                            )}>
                                {stat.trendUp && <TrendingUp className="h-3.5 w-3.5" />}
                                {stat.trend}
                                <span className="text-muted-foreground font-normal ml-1">
                                    {stat.trendUp ? 'from last month' : ''}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Pending Payments */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">Recent Payments</h3>
                            <p className="text-xs text-muted-foreground">Latest payment requests requiring action</p>
                        </div>
                        <button className="text-xs font-semibold text-primary hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-border">
                        <div className="grid grid-cols-4 px-6 py-3 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <div className="col-span-2">User & Sheet</div>
                            <div className="text-right">Amount</div>
                            <div className="text-right">Status</div>
                        </div>
                        {recentPayments.map((payment) => (
                            <div
                                key={payment.id}
                                className="grid grid-cols-4 items-center px-6 py-4 hover:bg-muted/20 transition-colors"
                            >
                                <div className="col-span-2 space-y-1">
                                    <p className="text-sm font-semibold text-foreground">{payment.user}</p>
                                    <p className="text-xs text-muted-foreground truncate">{payment.sheet}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">ETB {payment.amount}</p>
                                    <p className="text-[10px] text-muted-foreground">{payment.date}</p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                                            payment.status === 'pending'
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        )}
                                    >
                                        {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">New Members</h3>
                            <p className="text-xs text-muted-foreground">Students joined in the last 48 hours</p>
                        </div>
                        <button className="text-xs font-semibold text-primary hover:underline">Manage Users</button>
                    </div>
                    <div className="divide-y divide-border">
                         <div className="grid grid-cols-3 px-6 py-3 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <div className="col-span-2">User Info</div>
                            <div className="text-right">Joined</div>
                        </div>
                        {recentUsers.map((user) => (
                            <div
                                key={user.id}
                                className="grid grid-cols-3 items-center px-6 py-4 hover:bg-muted/20 transition-colors"
                            >
                                <div className="col-span-2 flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <p className="text-right text-xs text-muted-foreground">{user.joined}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">Revenue Goal</h3>
                            <p className="text-xs text-muted-foreground">Monthly performance target</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="text-3xl font-bold tracking-tight">ETB {stats.thisMonthRevenue.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground mb-1">Target: ETB 20,000</div>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '75%' }} />
                        </div>
                        <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            <span>75% Completed</span>
                            <span>25% Remaining</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight mb-1">Today's Performance</h3>
                        <p className="text-xs text-muted-foreground mb-6">Real-time revenue tracking</p>
                        <div className="text-4xl font-bold tracking-tight text-foreground">ETB {stats.todayRevenue.toLocaleString()}</div>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                            +5.2%
                        </span>
                        <span className="text-xs text-muted-foreground">Increased compared to yesterday</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

