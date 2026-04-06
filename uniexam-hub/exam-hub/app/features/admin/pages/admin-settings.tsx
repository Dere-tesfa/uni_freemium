import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Building, Phone, Plus, Save, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Define bank account type
export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    type: 'bank' | 'mobile';
    isActive: boolean;
    createdAt: string;
}

// Mock data
const initialBankAccounts: BankAccount[] = [
    {
        id: 'b1',
        bankName: 'Commercial Bank of Ethiopia (CBE)',
        accountNumber: '1000123456789',
        accountName: 'UniExam Hub',
        type: 'bank',
        isActive: true,
        createdAt: '2023-12-01',
    },
    {
        id: 'b2',
        bankName: 'Awash Bank',
        accountNumber: '0123456789012',
        accountName: 'UniExam Hub',
        type: 'bank',
        isActive: true,
        createdAt: '2023-12-15',
    },
    {
        id: 'b3',
        bankName: 'Telebirr',
        accountNumber: '0911223344',
        accountName: 'UniExam Hub',
        type: 'mobile',
        isActive: true,
        createdAt: '2024-01-01',
    },
    {
        id: 'b4',
        bankName: 'Dashen Bank',
        accountNumber: '1234567890123',
        accountName: 'UniExam Hub',
        type: 'bank',
        isActive: false,
        createdAt: '2024-01-05',
    },
];

export function meta() {
    return [{ title: 'Settings - UniExam Hub' }, { name: 'description', content: 'Manage application settings' }];
}

export default function AdminSettings() {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({
        bankName: '',
        accountNumber: '',
        accountName: '',
        type: 'bank',
        isActive: true,
    });

    const activeAccounts = bankAccounts.filter((a) => a.isActive).length;

    const handleAddAccount = () => {
        if (newAccount.bankName && newAccount.accountNumber && newAccount.accountName) {
            const account: BankAccount = {
                id: `b${Date.now()}`,
                bankName: newAccount.bankName,
                accountNumber: newAccount.accountNumber,
                accountName: newAccount.accountName,
                type: newAccount.type as 'bank' | 'mobile',
                isActive: true,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setBankAccounts([...bankAccounts, account]);
            setNewAccount({
                bankName: '',
                accountNumber: '',
                accountName: '',
                type: 'bank',
                isActive: true,
            });
            setShowAddModal(false);
        }
    };

    const handleToggleActive = (id: string) => {
        setBankAccounts(bankAccounts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
    };

    const handleDelete = (id: string) => {
        setBankAccounts(bankAccounts.filter((a) => a.id !== id));
    };

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">System Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure global application parameters and payment gateways
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bank Accounts Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold tracking-tight text-lg">Payment Accounts</h3>
                                <p className="text-xs text-muted-foreground">Accounts used for student transfers</p>
                            </div>
                            <Button
                                size="sm"
                                className="rounded-xl h-9 px-4 font-bold text-[10px] uppercase tracking-wider"
                                onClick={() => setShowAddModal(true)}
                            >
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                Add New
                            </Button>
                        </div>
                        <div className="divide-y divide-border">
                            {bankAccounts.map((account) => (
                                <div
                                    key={account.id}
                                    className={cn(
                                        'flex flex-col sm:flex-row sm:items-center justify-between p-6 transition-colors',
                                        account.isActive ? 'bg-card' : 'bg-muted/20 opacity-70',
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={cn(
                                                'size-12 rounded-xl flex items-center justify-center shadow-inner',
                                                account.type === 'mobile'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-blue-100 text-blue-600',
                                            )}
                                        >
                                            {account.type === 'mobile' ? (
                                                <Phone className="size-6" />
                                            ) : (
                                                <Building className="size-6" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-foreground">{account.bankName}</span>
                                                <span
                                                    className={cn(
                                                        'px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter',
                                                        account.isActive
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'bg-muted text-muted-foreground',
                                                    )}
                                                >
                                                    {account.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="text-[13px] text-muted-foreground space-y-0.5">
                                                <p className="font-medium text-foreground/80">{account.accountName}</p>
                                                <p className="font-mono text-xs tracking-tight">
                                                    {account.accountNumber}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                        <button
                                            onClick={() => handleToggleActive(account.id)}
                                            className={cn(
                                                'h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                                                account.isActive
                                                    ? 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                                    : 'bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-sm',
                                            )}
                                        >
                                            {account.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-9 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                            onClick={() => handleDelete(account.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start dark:bg-amber-900/10 dark:border-amber-900/20">
                        <AlertCircle className="size-6 text-amber-600 shrink-0" />
                        <div>
                            <h4 className="font-bold text-amber-900 dark:text-amber-400 tracking-tight">
                                Important Note
                            </h4>
                            <p className="text-sm text-amber-800 dark:text-amber-500 mt-1 leading-relaxed">
                                Ensure at least one bank account remains active to receive payments. Deactivating all
                                accounts will prevent students from completing purchases.
                            </p>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="space-y-6">
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border bg-muted/10">
                            <h3 className="font-bold tracking-tight text-lg">General Controls</h3>
                            <p className="text-xs text-muted-foreground">Application state management</p>
                        </div>
                        <div className="p-2 space-y-1">
                            {[
                                { label: 'Maintenance Mode', desc: 'Disable student-facing site', active: false },
                                { label: 'User Registration', desc: 'Allow new account signups', active: true },
                                { label: 'Email Notifications', desc: 'Auto-notify on payment', active: true },
                                { label: 'SMS Alerts (Telebirr)', desc: 'Instant mobile verification', active: false },
                            ].map((setting, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="max-w-[70%]">
                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                            {setting.label}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{setting.desc}</p>
                                    </div>
                                    <button
                                        className={cn(
                                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                            setting.active ? 'bg-primary' : 'bg-muted',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                                setting.active ? 'translate-x-5' : 'translate-x-0',
                                            )}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-border">
                            <Button className="w-full rounded-xl h-11 font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground shadow-md">
                                <Save className="size-4 mr-2" />
                                Save Preferences
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm text-center">
                        <h4 className="font-bold tracking-tight mb-2">Platform Version</h4>
                        <div className="flex items-center justify-center gap-2">
                            <Badge
                                variant="outline"
                                className="rounded-lg text-[10px] font-black tracking-widest uppercase py-1 border-primary/30 text-primary"
                            >
                                v2.4.0-stable
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                Build 8902
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-4 uppercase font-bold tracking-tighter">
                            Last deployed: March 24, 2026
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Account Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>Add Payment Account</CardTitle>
                            <CardDescription>
                                Add a new bank account or mobile money for receiving payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Account Type</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={newAccount.type === 'bank'}
                                            onChange={() => setNewAccount({ ...newAccount, type: 'bank' })}
                                        />
                                        Bank Account
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={newAccount.type === 'mobile'}
                                            onChange={() => setNewAccount({ ...newAccount, type: 'mobile' })}
                                        />
                                        Mobile Money
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bank/Mobile Name</label>
                                <Input
                                    placeholder={
                                        newAccount.type === 'mobile'
                                            ? 'e.g., Telebirr'
                                            : 'e.g., Commercial Bank of Ethiopia'
                                    }
                                    value={newAccount.bankName}
                                    onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Account Number</label>
                                <Input
                                    placeholder="e.g., 1000123456789"
                                    value={newAccount.accountNumber}
                                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Account Name</label>
                                <Input
                                    placeholder="e.g., UniExam Hub"
                                    value={newAccount.accountName}
                                    onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-4">
                                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddAccount}>
                                    <Save className="h-4 w-4 mr-1" />
                                    Save Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
