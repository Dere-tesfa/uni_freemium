import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Search, User, Mail, Phone, Edit, Trash2, Eye, Shield } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Define user type
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'student' | 'admin';
    purchasedSheets: number;
    createdAt: string;
    lastActive: string;
}

// Mock data
const initialUsers: User[] = [
    {
        id: 'u1',
        name: 'Abebe Kebede',
        email: 'abebe@email.com',
        phone: '+251912345678',
        role: 'student',
        purchasedSheets: 5,
        createdAt: '2024-01-10',
        lastActive: '2024-01-15',
    },
    {
        id: 'u2',
        name: 'Tigist Haile',
        email: 'tigist@email.com',
        phone: '+251912345679',
        role: 'student',
        purchasedSheets: 3,
        createdAt: '2024-01-08',
        lastActive: '2024-01-15',
    },
    {
        id: 'u3',
        name: 'Daniel Tadesse',
        email: 'daniel@email.com',
        phone: '+251912345680',
        role: 'student',
        purchasedSheets: 8,
        createdAt: '2024-01-05',
        lastActive: '2024-01-14',
    },
    {
        id: 'u4',
        name: 'Sara Mohammed',
        email: 'sara@email.com',
        phone: '+251912345681',
        role: 'student',
        purchasedSheets: 2,
        createdAt: '2024-01-12',
        lastActive: '2024-01-13',
    },
    {
        id: 'u5',
        name: 'Admin User',
        email: 'admin@uniexam.com',
        phone: '+251911223344',
        role: 'admin',
        purchasedSheets: 0,
        createdAt: '2023-12-01',
        lastActive: '2024-01-15',
    },
    {
        id: 'u6',
        name: 'Mikias Yilma',
        email: 'mikias@email.com',
        phone: '+251912345682',
        role: 'student',
        purchasedSheets: 1,
        createdAt: '2024-01-14',
        lastActive: '2024-01-14',
    },
];

export function meta() {
    return [{ title: 'User Management - UniExam Hub' }, { name: 'description', content: 'Manage registered users' }];
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all');

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalUsers = users.length;
    const studentCount = users.filter((u) => u.role === 'student').length;
    const adminCount = users.filter((u) => u.role === 'admin').length;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Oversee student accounts and administrative permissions
                    </p>
                </div>
                <Button
                    size="sm"
                    className="rounded-xl h-10 px-5 shadow-md font-semibold text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all"
                >
                    <User className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: 'Total Accounts',
                        value: totalUsers,
                        icon: User,
                        color: 'text-primary',
                        bg: 'bg-primary/10',
                    },
                    {
                        label: 'Active Students',
                        value: studentCount,
                        icon: Shield,
                        color: 'text-blue-500',
                        bg: 'bg-blue-500/10',
                    },
                    {
                        label: 'Administrators',
                        value: adminCount,
                        icon: Shield,
                        color: 'text-orange-500',
                        bg: 'bg-orange-500/10',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="p-6 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-4"
                    >
                        <div className={cn('p-3 rounded-xl', stat.bg)}>
                            <stat.icon className={cn('size-6', stat.color)} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                            </p>
                            <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or phone number..."
                            className="pl-12 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex p-1 bg-muted/50 rounded-xl">
                        {(['all', 'student', 'admin'] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={cn(
                                    'px-5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all',
                                    roleFilter === role
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {role}s
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table-like List */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/10">
                    <h3 className="font-bold tracking-tight">Registered Users</h3>
                    <p className="text-xs text-muted-foreground">{filteredUsers.length} total members found</p>
                </div>
                <div className="divide-y divide-border">
                    <div className="grid grid-cols-12 px-6 py-3 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="col-span-5 lg:col-span-4">User Information</div>
                        <div className="hidden lg:block col-span-3">Contact Details</div>
                        <div className="col-span-3 lg:col-span-2 text-right">Activity/Stats</div>
                        <div className="col-span-2 lg:col-span-1 text-center">Role</div>
                        <div className="col-span-2 lg:col-span-2 text-right">Actions</div>
                    </div>
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="grid grid-cols-12 items-center px-6 py-5 hover:bg-muted/20 transition-colors group"
                        >
                            <div className="col-span-5 lg:col-span-4 flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight">
                                        Joined {user.createdAt}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden lg:block col-span-3">
                                <div className="flex items-center gap-2 text-xs text-foreground/80 mb-0.5">
                                    <Mail className="size-3 text-muted-foreground" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                    <Phone className="size-3" />
                                    {user.phone}
                                </div>
                            </div>
                            <div className="col-span-3 lg:col-span-2 text-right">
                                <p className="text-xs font-bold text-foreground">
                                    {user.role === 'student' ? `${user.purchasedSheets} Sheets` : 'Unlimited'}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-medium">
                                    Active {user.lastActive}
                                </p>
                            </div>
                            <div className="col-span-2 lg:col-span-1 text-center">
                                <span
                                    className={cn(
                                        'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter',
                                        user.role === 'admin'
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                                    )}
                                >
                                    {user.role}
                                </span>
                            </div>
                            <div className="col-span-2 lg:col-span-2 flex justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    <Eye className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    <Edit className="size-4" />
                                </Button>
                                {user.role === 'student' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="size-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <User className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold tracking-tight text-lg">No users found</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                                Try refining your search or filter criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
