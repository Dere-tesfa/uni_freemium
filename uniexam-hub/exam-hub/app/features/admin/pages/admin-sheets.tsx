import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Search, Plus, Edit, Trash2, Eye, FileText, Download, Filter, Gift } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Define types
export interface ExamSheet {
    id: string;
    title: string;
    courseCode: string;
    university: string;
    department: string;
    year: number;
    price: number;
    isFree: boolean;
    isPublished: boolean;
    questionCount: number;
    createdAt: string;
    updatedAt: string;
}

// Mock data
const initialSheets: ExamSheet[] = [
    {
        id: 's1',
        title: 'Physics Final Exam 2023',
        courseCode: 'PHY301',
        university: 'Addis Ababa University',
        department: 'Physics',
        year: 2023,
        price: 150,
        isFree: false,
        isPublished: true,
        questionCount: 50,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15',
    },
    {
        id: 's2',
        title: 'Chemistry Midterm Package',
        courseCode: 'CHE201',
        university: 'Addis Ababa University',
        department: 'Chemistry',
        year: 2023,
        price: 200,
        isFree: false,
        isPublished: true,
        questionCount: 30,
        createdAt: '2024-01-08',
        updatedAt: '2024-01-12',
    },
    {
        id: 's3',
        title: 'Math Quiz Set 5',
        courseCode: 'MTH101',
        university: 'Bahir Dar University',
        department: 'Mathematics',
        year: 2024,
        price: 0,
        isFree: true,
        isPublished: true,
        questionCount: 20,
        createdAt: '2024-01-05',
        updatedAt: '2024-01-05',
    },
    {
        id: 's4',
        title: 'Biology Full Package',
        courseCode: 'BIO401',
        university: 'Addis Ababa University',
        department: 'Biology',
        year: 2023,
        price: 250,
        isFree: false,
        isPublished: true,
        questionCount: 100,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
    },
    {
        id: 's5',
        title: 'Engineering Mathematics I',
        courseCode: 'ENG101',
        university: 'Ethiopia Institute of Technology',
        department: 'Engineering',
        year: 2024,
        price: 180,
        isFree: false,
        isPublished: false,
        questionCount: 45,
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14',
    },
];

export function meta() {
    return [
        { title: 'Exam Sheets Management - UniExam Hub' },
        { name: 'description', content: 'Create and manage exam sheets' },
    ];
}

export default function AdminSheets() {
    const [sheets, setSheets] = useState<ExamSheet[]>(initialSheets);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSheet, setEditingSheet] = useState<ExamSheet | null>(null);

    const filteredSheets = sheets.filter((sheet) => {
        return (
            sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sheet.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sheet.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sheet.department.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const publishedCount = sheets.filter((s) => s.isPublished).length;
    const freeCount = sheets.filter((s) => s.isFree).length;
    const totalQuestions = sheets.reduce((acc, s) => acc + s.questionCount, 0);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Exam Sheets</h1>
                    <p className="text-muted-foreground mt-1">Create, edit and manage exam content for students</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-10 px-4 font-semibold text-xs uppercase tracking-wider"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-xl h-10 px-5 shadow-md font-semibold text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Sheet
                    </Button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Total Sheets',
                        value: sheets.length,
                        icon: FileText,
                        color: 'text-blue-500',
                        bg: 'bg-blue-500/10',
                    },
                    {
                        label: 'Published',
                        value: publishedCount,
                        icon: Eye,
                        color: 'text-green-500',
                        bg: 'bg-green-500/10',
                    },
                    {
                        label: 'Free Content',
                        value: freeCount,
                        icon: Gift,
                        color: 'text-amber-500',
                        bg: 'bg-amber-500/10',
                    },
                    {
                        label: 'Questions',
                        value: totalQuestions.toLocaleString(),
                        icon: Filter,
                        color: 'text-purple-500',
                        bg: 'bg-purple-500/10',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="p-6 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors group"
                    >
                        <div className={cn('p-3 rounded-xl transition-colors', stat.bg)}>
                            {typeof stat.icon === 'string' ? (
                                stat.icon
                            ) : (
                                <stat.icon className={cn('size-5', stat.color)} />
                            )}
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
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, course code, university, or department..."
                        className="pl-12 h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Sheets Table-like List */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/10 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold tracking-tight">Content Repository</h3>
                        <p className="text-xs text-muted-foreground">{filteredSheets.length} sheets in database</p>
                    </div>
                </div>
                <div className="divide-y divide-border">
                    <div className="grid grid-cols-12 px-6 py-3 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="col-span-5 lg:col-span-4">Exam Details</div>
                        <div className="hidden lg:block col-span-3">Department & Uni</div>
                        <div className="col-span-3 lg:col-span-2 text-right">Price/Stats</div>
                        <div className="col-span-2 lg:col-span-1 text-center">Status</div>
                        <div className="col-span-2 lg:col-span-2 text-right">Actions</div>
                    </div>
                    {filteredSheets.map((sheet) => (
                        <div
                            key={sheet.id}
                            className="grid grid-cols-12 items-center px-6 py-5 hover:bg-muted/20 transition-colors group"
                        >
                            <div className="col-span-5 lg:col-span-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {sheet.title}
                                    </p>
                                    {sheet.isFree && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-tighter">
                                            Free
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                    <span className="font-bold text-foreground/70">{sheet.courseCode}</span>
                                    <span>•</span>
                                    <span>Year {sheet.year}</span>
                                </div>
                            </div>
                            <div className="hidden lg:block col-span-3">
                                <p className="text-xs font-semibold text-foreground/80 line-clamp-1">
                                    {sheet.university}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                    {sheet.department}
                                </p>
                            </div>
                            <div className="col-span-3 lg:col-span-2 text-right">
                                <p className="text-sm font-black tracking-tighter text-foreground">ETB {sheet.price}</p>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase">
                                    {sheet.questionCount} Questions
                                </p>
                            </div>
                            <div className="col-span-2 lg:col-span-1 text-center">
                                <span
                                    className={cn(
                                        'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter',
                                        sheet.isPublished
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {sheet.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <div className="col-span-2 lg:col-span-2 flex justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                    onClick={() => setEditingSheet(sheet)}
                                >
                                    <Edit className="size-4" />
                                </Button>
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
                                    className="size-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {filteredSheets.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="size-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                                <FileText className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold tracking-tight text-lg">No exam sheets found</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                                Try adjusting your search criteria or create a new sheet to get started.
                            </p>
                            <Button size="sm" className="mt-6 rounded-xl" onClick={() => setShowCreateModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Sheet
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || editingSheet) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <CardTitle>{editingSheet ? 'Edit Exam Sheet' : 'Create New Exam Sheet'}</CardTitle>
                            <CardDescription>
                                {editingSheet
                                    ? 'Update the exam sheet details'
                                    : 'Fill in the details to create a new exam sheet'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        placeholder="e.g., Physics Final Exam 2023"
                                        defaultValue={editingSheet?.title}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Course Code</label>
                                    <Input placeholder="e.g., PHY301" defaultValue={editingSheet?.courseCode} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">University</label>
                                    <Input
                                        placeholder="e.g., Addis Ababa University"
                                        defaultValue={editingSheet?.university}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department</label>
                                    <Input placeholder="e.g., Physics" defaultValue={editingSheet?.department} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Year</label>
                                    <Input type="number" placeholder="e.g., 2023" defaultValue={editingSheet?.year} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price (ETB)</label>
                                    <Input type="number" placeholder="0 for free" defaultValue={editingSheet?.price} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Number of Questions</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g., 50"
                                        defaultValue={editingSheet?.questionCount}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="published"
                                                defaultChecked={editingSheet?.isPublished ?? true}
                                            />{' '}
                                            Published
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="published"
                                                defaultChecked={!editingSheet?.isPublished}
                                            />{' '}
                                            Draft
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Is Free?</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="isFree"
                                            defaultChecked={editingSheet?.isFree ?? false}
                                        />{' '}
                                        Yes, Free
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="isFree" defaultChecked={!editingSheet?.isFree} /> No,
                                        Premium
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingSheet(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button>{editingSheet ? 'Update Sheet' : 'Create Sheet'}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
