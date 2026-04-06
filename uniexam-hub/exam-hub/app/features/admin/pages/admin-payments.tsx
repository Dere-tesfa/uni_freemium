import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Search, CheckCircle, XCircle, Clock, Eye, CreditCard } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Define payment type
export interface Payment {
    id: number;
    userId: string;
    user: string;
    phone: string;
    amount: number;
    sheet: string;
    sheetId: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
    screenshotUrl: string;
    bankAccount: string;
    approvedAt?: string;
    approvedBy?: string;
    rejectedAt?: string;
    rejectedBy?: string;
    rejectionReason?: string;
}

// Mock payment data
const initialPayments: Payment[] = [
    {
        id: 1,
        userId: 'u1',
        user: 'Abebe Kebede',
        phone: '+251912345678',
        amount: 150,
        sheet: 'Physics Final Exam 2023',
        sheetId: 's1',
        status: 'pending',
        date: '2024-01-15',
        screenshotUrl: '/screenshots/payment1.jpg',
        bankAccount: 'CBE 1000123456789',
    },
    {
        id: 2,
        userId: 'u2',
        user: 'Tigist Haile',
        phone: '+251912345679',
        amount: 200,
        sheet: 'Chemistry Midterm Package',
        sheetId: 's2',
        status: 'pending',
        date: '2024-01-15',
        screenshotUrl: '/screenshots/payment2.jpg',
        bankAccount: 'Awash 0123456789012',
    },
    {
        id: 3,
        userId: 'u3',
        user: 'Daniel Tadesse',
        phone: '+251912345680',
        amount: 100,
        sheet: 'Math Quiz Set 5',
        sheetId: 's3',
        status: 'pending',
        date: '2024-01-14',
        screenshotUrl: '/screenshots/payment3.jpg',
        bankAccount: 'Telebirr 0911223344',
    },
    {
        id: 4,
        userId: 'u4',
        user: 'Sara Mohammed',
        phone: '+251912345681',
        amount: 250,
        sheet: 'Biology Full Package',
        sheetId: 's4',
        status: 'approved',
        date: '2024-01-14',
        screenshotUrl: '/screenshots/payment4.jpg',
        bankAccount: 'CBE 1000123456789',
        approvedAt: '2024-01-14',
        approvedBy: 'admin',
    },
    {
        id: 5,
        userId: 'u5',
        user: 'Mikias Yilma',
        phone: '+251912345682',
        amount: 180,
        sheet: 'Engineering Mathematics I',
        sheetId: 's5',
        status: 'rejected',
        date: '2024-01-13',
        screenshotUrl: '/screenshots/payment5.jpg',
        bankAccount: 'CBE 1000123456789',
        rejectedAt: '2024-01-13',
        rejectedBy: 'admin',
        rejectionReason: 'Incorrect amount transferred. Expected 180 ETB, received 100 ETB.',
    },
];

export function meta() {
    return [
        { title: 'Payment Management - UniExam Hub' },
        { name: 'description', content: 'Manage and verify payment requests' },
    ];
}

export default function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>(initialPayments);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.phone.includes(searchQuery) ||
            payment.sheet.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingCount = payments.filter((p) => p.status === 'pending').length;
    const approvedCount = payments.filter((p) => p.status === 'approved').length;
    const totalAmount = payments.filter((p) => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);

    const handleApprove = (paymentId: number) => {
        setPayments(
            payments.map((p) =>
                p.id === paymentId
                    ? {
                          ...p,
                          status: 'approved' as const,
                          approvedAt: new Date().toISOString().split('T')[0],
                          approvedBy: 'admin',
                      }
                    : p,
            ),
        );
        setSelectedPayment(null);
    };

    const handleReject = (paymentId: number) => {
        setPayments(
            payments.map((p) =>
                p.id === paymentId
                    ? {
                          ...p,
                          status: 'rejected' as const,
                          rejectedAt: new Date().toISOString().split('T')[0],
                          rejectedBy: 'admin',
                          rejectionReason: rejectReason,
                      }
                    : p,
            ),
        );
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedPayment(null);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>
                    <p className="text-muted-foreground mt-1">Verify and manage payment requests from students</p>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30 rounded-xl shadow-sm">
                        <div className="size-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                            {pendingCount} Pending Requests
                        </span>
                    </div>
                )}
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: 'Pending Verification',
                        value: pendingCount,
                        icon: Clock,
                        color: 'text-amber-500',
                        bg: 'bg-amber-500/10',
                    },
                    {
                        label: 'Approved Today',
                        value: approvedCount,
                        icon: CheckCircle,
                        color: 'text-green-500',
                        bg: 'bg-green-500/10',
                    },
                    {
                        label: 'Total Revenue',
                        value: `ETB ${totalAmount.toLocaleString()}`,
                        icon: CreditCard,
                        color: 'text-primary',
                        bg: 'bg-primary/10',
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
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by student name, phone, or sheet title..."
                            className="pl-10 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex p-1 bg-muted/50 rounded-xl">
                        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all',
                                    statusFilter === status
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payments Table-like List */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/10">
                    <h3 className="font-bold tracking-tight">Payment Requests</h3>
                    <p className="text-xs text-muted-foreground">{filteredPayments.length} transactions found</p>
                </div>
                <div className="divide-y divide-border">
                    <div className="grid grid-cols-12 px-6 py-3 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="col-span-4 lg:col-span-3">Student Info</div>
                        <div className="hidden lg:block col-span-3">Exam Sheet</div>
                        <div className="col-span-3 lg:col-span-2 text-right">Amount</div>
                        <div className="col-span-2 lg:col-span-2 text-center">Status</div>
                        <div className="col-span-3 lg:col-span-2 text-right">Actions</div>
                    </div>
                    {filteredPayments.map((payment) => (
                        <div
                            key={payment.id}
                            className="grid grid-cols-12 items-center px-6 py-5 hover:bg-muted/20 transition-colors group"
                        >
                            <div className="col-span-4 lg:col-span-3">
                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                    {payment.user}
                                </p>
                                <p className="text-xs text-muted-foreground">{payment.phone}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{payment.date}</p>
                            </div>
                            <div className="hidden lg:block col-span-3">
                                <p className="text-xs font-medium text-foreground line-clamp-1">{payment.sheet}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter mt-1">
                                    {payment.bankAccount}
                                </p>
                            </div>
                            <div className="col-span-3 lg:col-span-2 text-right">
                                <p className="text-sm font-black tracking-tighter text-foreground">
                                    ETB {payment.amount}
                                </p>
                            </div>
                            <div className="col-span-2 lg:col-span-2 text-center">
                                <span
                                    className={cn(
                                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter',
                                        payment.status === 'pending'
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            : payment.status === 'approved'
                                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                                    )}
                                >
                                    {payment.status}
                                </span>
                            </div>
                            <div className="col-span-3 lg:col-span-2 flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-lg"
                                    onClick={() => setSelectedPayment(payment)}
                                >
                                    <Eye className="size-4" />
                                </Button>
                                {payment.status === 'pending' && (
                                    <>
                                        <button
                                            className="size-8 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                                            onClick={() => handleApprove(payment.id)}
                                        >
                                            <CheckCircle className="size-4" />
                                        </button>
                                        <button
                                            className="size-8 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                            onClick={() => {
                                                setSelectedPayment(payment);
                                                setShowRejectModal(true);
                                            }}
                                        >
                                            <XCircle className="size-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            {payment.status === 'rejected' && payment.rejectionReason && (
                                <div className="col-span-12 mt-3 p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 text-[11px] text-red-600 dark:text-red-400">
                                    <span className="font-bold uppercase tracking-wider mr-2">Reason:</span>
                                    {payment.rejectionReason}
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredPayments.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold">No payments found</h3>
                            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>Reject Payment</CardTitle>
                            <CardDescription>
                                Are you sure you want to reject this payment from {selectedPayment.user}?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <p>
                                    <strong>Amount:</strong> ETB {selectedPayment.amount}
                                </p>
                                <p>
                                    <strong>Sheet:</strong> {selectedPayment.sheet}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Rejection Reason (required)</label>
                                <Input
                                    placeholder="e.g., Incorrect amount transferred..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setSelectedPayment(null);
                                        setRejectReason('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={!rejectReason.trim()}
                                    onClick={() => handleReject(selectedPayment.id)}
                                >
                                    Reject Payment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
