import { Link, useLoaderData, useSearchParams } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/departments";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Monitor,
  FlaskConical,
  Wrench,
  Stethoscope,
  Calculator,
  Gavel,
  Globe,
  BookMarked,
  Landmark,
  Leaf,
  HeartPulse,
  ArrowRight,
  Search,
  Users,
  BookOpen,
  Star,
  TrendingUp,
  GraduationCap,
  Award,
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────
interface FeaturedExam {
  id: string;
  title: string;
  price: number;
  rating: number;
  year: string;
}

interface Department {
  id: string;
  name: string;
  shortName: string;
  icon: any; // Using any for icons to stay safe with Lucide version
  color: string;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
  description: string;
  students: string;
  exams: number;
  avgRating: number;
  topInstructor: string;
  tags: string[];
  featuredExams: FeaturedExam[];
  color2: string;
}

const DEPARTMENTS: Department[] = [
  {
    id: "computer-science",
    name: "Computer Science",
    shortName: "CS",
    icon: Monitor,
    color: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-500/10 text-blue-700 border-blue-200",
    description:
      "Covers data structures, algorithms, software engineering, AI/ML, databases, and system design. One of the fastest-growing and most competitive departments.",
    students: "3,200+",
    exams: 18,
    avgRating: 4.8,
    topInstructor: "Dr. Amanuel Kebede",
    tags: ["Algorithms", "OOP", "Databases", "AI", "Networking"],
    featuredExams: [
      { id: "1", title: "CS-101 Final Exam", price: 15, rating: 4.8, year: "2023/2024" },
    ],
    color2: "blue",
  },
  {
    id: "biology",
    name: "Biology",
    shortName: "BIO",
    icon: FlaskConical,
    color: "from-green-500/20 to-green-600/5",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
    badgeColor: "bg-green-500/10 text-green-700 border-green-200",
    description:
      "Explores life sciences from molecular biology and genetics to ecology and human physiology. A cornerstone for students pursuing medicine and research careers.",
    students: "2,800+",
    exams: 14,
    avgRating: 4.9,
    topInstructor: "Prof. Sara Girma",
    tags: ["Cell Biology", "Genetics", "Ecology", "Physiology", "Microbiology"],
    featuredExams: [
      { id: "2", title: "Bio-202 Midterm", price: 20, rating: 4.9, year: "2023/2024" },
    ],
    color2: "green",
  },
  {
    id: "engineering",
    name: "Engineering",
    shortName: "ENG",
    icon: Wrench,
    color: "from-orange-500/20 to-orange-600/5",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
    badgeColor: "bg-orange-500/10 text-orange-700 border-orange-200",
    description:
      "Encompasses civil, mechanical, electrical, and chemical engineering disciplines. Heavy focus on problem-solving, design principles, and applied mathematics.",
    students: "4,100+",
    exams: 22,
    avgRating: 4.7,
    topInstructor: "Dr. Yonas Tesfaye",
    tags: ["Thermodynamics", "Circuit Design", "Statics", "Mechanics", "Control Systems"],
    featuredExams: [
      { id: "3", title: "Eng-305 Analysis", price: 25, rating: 4.7, year: "2022/2023" },
    ],
    color2: "orange",
  },
  {
    id: "medicine",
    name: "Medicine",
    shortName: "MED",
    icon: Stethoscope,
    color: "from-red-500/20 to-red-600/5",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600",
    badgeColor: "bg-red-500/10 text-red-700 border-red-200",
    description:
      "Rigorous curriculum covering anatomy, physiology, pathology, pharmacology, and clinical medicine. Requires consistent mastery of vast medical knowledge.",
    students: "2,200+",
    exams: 30,
    avgRating: 5.0,
    topInstructor: "Dr. Hiwot Alemu",
    tags: ["Anatomy", "Pharmacology", "Pathology", "Physiology", "Clinical"],
    featuredExams: [
      { id: "4", title: "Med-101 Anatomy", price: 30, rating: 5.0, year: "2023/2024" },
    ],
    color2: "red",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    shortName: "MATH",
    icon: Calculator,
    color: "from-purple-500/20 to-purple-600/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
    badgeColor: "bg-purple-500/10 text-purple-700 border-purple-200",
    description:
      "From calculus and linear algebra to statistics and discrete mathematics. Fundamental to all STEM fields and increasingly critical for AI and data science.",
    students: "3,600+",
    exams: 20,
    avgRating: 4.6,
    topInstructor: "Prof. Tamirat Bekele",
    tags: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math", "Number Theory"],
    featuredExams: [
      { id: "5", title: "Math-201 Calculus", price: 18, rating: 4.6, year: "2022/2023" },
    ],
    color2: "purple",
  },
  {
    id: "architecture",
    name: "Architecture",
    shortName: "ARCH",
    icon: BookOpen,
    color: "from-yellow-500/20 to-yellow-600/5",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-600",
    badgeColor: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    description:
      "A blend of art, science, and technology covering design theory, structural systems, sustainable architecture, and urban planning at advanced levels.",
    students: "900+",
    exams: 10,
    avgRating: 4.9,
    topInstructor: "Arch. Dawit Solomon",
    tags: ["Urban Planning", "Sustainable Design", "Structural Systems", "Design Theory", "BIM"],
    featuredExams: [
      { id: "6", title: "Arch-404 Design", price: 40, rating: 4.9, year: "2023/2024" },
    ],
    color2: "yellow",
  },
  {
    id: "law",
    name: "Law",
    shortName: "LAW",
    icon: Award, // Gavel might be problematic in v1.6
    color: "from-slate-500/20 to-slate-600/5",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-600",
    badgeColor: "bg-slate-500/10 text-slate-700 border-slate-200",
    description:
      "Ethiopian and international law, constitutional studies, commercial law, criminal procedure, and human rights. Demanding analytical writing and case study analysis.",
    students: "1,800+",
    exams: 12,
    avgRating: 4.5,
    topInstructor: "Prof. Tigist Haile",
    tags: ["Constitutional Law", "Criminal Law", "Commercial Law", "Human Rights", "Civil Procedure"],
    featuredExams: [],
    color2: "slate",
  },
  {
    id: "social-sciences",
    name: "Social Sciences",
    shortName: "SOC",
    icon: Globe,
    color: "from-teal-500/20 to-teal-600/5",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-600",
    badgeColor: "bg-teal-500/10 text-teal-700 border-teal-200",
    description:
      "Interdisciplinary study of sociology, anthropology, political science, and economics. Emphasizes critical thinking, research methodology, and societal analysis.",
    students: "2,400+",
    exams: 16,
    avgRating: 4.4,
    topInstructor: "Dr. Meselech Worku",
    tags: ["Sociology", "Economics", "Political Science", "Anthropology", "Research Methods"],
    featuredExams: [],
    color2: "teal",
  },
  {
    id: "natural-sciences",
    name: "Natural Sciences",
    shortName: "NSC",
    icon: Leaf,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    description:
      "Physics, chemistry, and earth sciences. Strong quantitative foundation combining laboratory work with theoretical understanding of the natural world.",
    students: "1,500+",
    exams: 15,
    avgRating: 4.5,
    topInstructor: "Dr. Abebe Girma",
    tags: ["Physics", "Chemistry", "Earth Sciences", "Thermodynamics", "Optics"],
    featuredExams: [],
    color2: "emerald",
  },
  {
    id: "economics",
    name: "Economics",
    shortName: "ECON",
    icon: TrendingUp,
    color: "from-indigo-500/20 to-indigo-600/5",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
    badgeColor: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    description:
      "Micro and macroeconomics, econometrics, development economics, and monetary theory. Combines rigorous quantitative methods with real-world policy analysis.",
    students: "2,100+",
    exams: 13,
    avgRating: 4.6,
    topInstructor: "Prof. Dereje Wolde",
    tags: ["Microeconomics", "Macroeconomics", "Econometrics", "Development", "Game Theory"],
    featuredExams: [],
    color2: "indigo",
  },
  {
    id: "nursing",
    name: "Nursing",
    shortName: "NUR",
    icon: HeartPulse || Star,
    color: "from-pink-500/20 to-pink-600/5",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-600",
    badgeColor: "bg-pink-500/10 text-pink-700 border-pink-200",
    description:
      "Evidence-based nursing practice, patient care, clinical pharmacology, and health assessment. Combines theoretical knowledge with hands-on clinical readiness.",
    students: "1,700+",
    exams: 11,
    avgRating: 4.7,
    topInstructor: "Sr. Almaz Bekele",
    tags: ["Patient Care", "Pharmacology", "Health Assessment", "Pediatrics", "Critical Care"],
    featuredExams: [],
    color2: "pink",
  },
  {
    id: "literature",
    name: "Literature & Languages",
    shortName: "LIT",
    icon: BookOpen, // Stabilizing icons
    color: "from-rose-500/20 to-rose-600/5",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600",
    badgeColor: "bg-rose-500/10 text-rose-700 border-rose-200",
    description:
      "Amharic, English, and comparative literature, linguistics, and creative writing. Develops critical analysis, interpretation, and academic writing skills.",
    students: "1,100+",
    exams: 9,
    avgRating: 4.3,
    topInstructor: "Dr. Yeshi Mulatu",
    tags: ["Amharic Literature", "English Literature", "Linguistics", "Creative Writing", "Translation"],
    featuredExams: [],
    color2: "rose",
  },
];

const CATEGORIES = ["All Departments", "STEM", "Health Sciences", "Humanities & Social", "Professional"];

const CATEGORY_MAP: Record<string, string[]> = {
  "STEM": ["computer-science", "mathematics", "engineering", "natural-sciences", "biology"],
  "Health Sciences": ["medicine", "nursing", "biology"],
  "Humanities & Social": ["social-sciences", "economics", "literature", "law"],
  "Professional": ["architecture", "law", "engineering"],
};

export async function loader() {
  const totalExams = DEPARTMENTS.reduce((s, d) => s + d.exams, 0);
  const totalStudents = "24,000+";
  return { departments: DEPARTMENTS, totalExams, totalStudents };
}

export function meta() {
  return [
    { title: "All Departments – UniExam Hub" },
    { name: "description", content: "Browse all university departments and their premium past exam resources." },
  ];
}

export default function DepartmentsPage() {
  const data = useLoaderData<typeof loader>();
  
  if (!data) return null;
  
  const { departments, totalExams, totalStudents } = data;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Departments");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Filter logic
  const filtered = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(query.toLowerCase()) ||
      dept.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory =
      activeCategory === "All Departments" ||
      (CATEGORY_MAP[activeCategory] ?? []).includes(dept.id);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-background to-background pt-14 pb-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 size-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-[500px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <Badge variant="secondary" className="mb-5 px-5 py-2 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">
            <GraduationCap className="size-3.5 mr-1.5" /> University Departments
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground mb-5 text-balance">
            Explore All <span className="text-primary">Departments</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground mb-10 text-balance">
            Browse premium past exams across every university department. Verified by faculty, enhanced with AI explanations.
          </p>

          {/* Global stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { icon: BookOpen,     value: `${totalExams}+`, label: "Total Exams" },
              { icon: Users,        value: totalStudents,    label: "Active Students" },
              { icon: GraduationCap, value: `${departments.length}`,    label: "Departments" },
              { icon: Award,        value: "4.7",            label: "Avg. Rating" },
            ].map(({ icon: Icon, value, label }: any) => (
              <div key={label} className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-2xl font-black text-primary">
                  {Icon && <Icon className="size-5" />}
                  <span>{value}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="dept-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search departments or topics…"
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Category Tabs ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Departments Grid ──────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="size-7 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No departments found</h2>
            <p className="text-muted-foreground text-sm">Try a different search term or category.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setActiveCategory("All Departments"); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing <strong className="text-foreground">{filtered.length}</strong> of {departments.length} departments
              {query && <> matching "<strong className="text-foreground">{query}</strong>"</>}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((dept) => {
                const Icon = dept.icon as any;
                const isExpanded = expanded === dept.id;

                return (
                  <div
                    key={dept.id}
                    className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className={`bg-gradient-to-br ${dept.color} p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`size-12 rounded-xl ${dept.iconBg} flex items-center justify-center`}>
                          {Icon && typeof Icon === 'function' ? (
                            <Icon className={`size-6 ${dept.iconColor}`} />
                          ) : (
                            <BookOpen className={`size-6 ${dept.iconColor}`} />
                          )}
                        </div>
                        <Badge className={`text-xs font-bold border ${dept.badgeColor} bg-transparent px-2.5`}>
                          {dept.shortName}
                        </Badge>
                      </div>
                      <h2 className="text-xl font-black text-foreground mb-1.5">{dept.name}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {dept.description}
                      </p>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
                      {[
                        { label: "Students", value: dept.students, icon: Users },
                        { label: "Exams",    value: dept.exams,    icon: BookOpen },
                        { label: "Rating",   value: dept.avgRating, icon: Star },
                      ].map(({ label, value, icon: SIcon }: any) => (
                        <div key={label} className="flex flex-col items-center py-3 px-2">
                          <div className="flex items-center gap-1 font-black text-sm text-foreground">
                            {SIcon && <SIcon className={`size-3.5 ${dept.iconColor}`} />}
                            <span>{value}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col gap-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {dept.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                          {dept.topInstructor.split(" ").pop()![0]}
                          {dept.topInstructor.split(" ").slice(-2, -1)[0]?.[0] ?? ""}
                        </div>
                        <span>Top instructor: <strong className="text-foreground">{dept.topInstructor}</strong></span>
                      </div>

                      {/* Expand/Collapse featured exams */}
                      {dept.featuredExams.length > 0 && (
                        <div>
                          <button
                            onClick={() => setExpanded(isExpanded ? null : dept.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors"
                          >
                            <BookOpen className="size-3.5" />
                            {isExpanded ? "Hide" : "Show"} Featured Exam
                          </button>

                          {isExpanded && (
                            <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                              {dept.featuredExams.map((exam) => (
                                <Link
                                  key={exam.id}
                                  to={`/exams/${exam.id}`}
                                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-md transition-all group/exam"
                                >
                                  <div>
                                    <p className="text-xs font-bold group-hover/exam:text-primary transition-colors">{exam.title}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Star className="size-3 fill-yellow-400 stroke-yellow-500 text-yellow-500" />
                                      <span className="text-[11px] text-muted-foreground">{exam.rating} · {exam.year}</span>
                                    </div>
                                  </div>
                                  <span className="text-primary font-black text-sm shrink-0 ml-2">${exam.price}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-auto pt-2 flex gap-2">
                        <Link
                          to={`/exams?dept=${dept.id}`}
                          id={`dept-browse-${dept.id}`}
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full gap-1.5 font-bold text-xs">
                            Browse Exams
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-3 font-bold text-xs"
                          onClick={() => setExpanded(isExpanded ? null : dept.id)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom CTA Banner ────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl bg-primary p-10 md:p-14 text-primary-foreground relative overflow-hidden text-center shadow-2xl">
            <div className="absolute -top-16 -right-16 size-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 size-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <GraduationCap className="size-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Can't find your department?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                We're constantly adding new departments and exam resources. Request yours and we'll notify you when it goes live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/auth/signup">
                  <Button variant="secondary" size="lg" className="font-bold px-8">
                    Request a Department
                  </Button>
                </Link>
                <Link to="/exams">
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-bold px-8 bg-transparent border-white/30 hover:bg-white/10 text-white"
                  >
                    Browse All Exams
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
