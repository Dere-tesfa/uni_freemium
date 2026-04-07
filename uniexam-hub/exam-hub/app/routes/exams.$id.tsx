import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/exams.$id";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  Download,
  Sparkles,
  FileText,
  Award,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

// Shared mock data – in a real app this would be a DB call
const EXAMS = [
  {
    id: "1",
    title: "CS-101 Final Exam",
    dept: "Computer Science",
    price: 15,
    rating: 4.8,
    purchases: "1.2k",
    year: "2023/2024",
    duration: "3 hours",
    questions: 60,
    difficulty: "Intermediate",
    instructor: "Dr. Amanuel Kebede",
    description:
      "Comprehensive final exam covering data structures, algorithms, object-oriented programming, and system design fundamentals. Includes detailed model answers and step-by-step AI explanations for every question.",
    topics: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Database Fundamentals",
      "Operating Systems Basics",
      "System Design Principles",
      "Complexity Analysis (Big-O)",
    ],
    includes: [
      "Full exam paper (PDF + interactive)",
      "Model answers with explanations",
      "AI-powered question walkthroughs",
      "Performance tracker dashboard",
      "Printable study cards",
    ],
    reviews: [
      { name: "Selam T.", rating: 5, comment: "Exactly what I needed to pass! The AI explanations saved so much time.", avatar: "ST" },
      { name: "Biniyam A.", rating: 5, comment: "Very well structured. The difficulty level matches the real exam perfectly.", avatar: "BA" },
      { name: "Hana M.", rating: 4, comment: "Great resource. Loved the model answers section.", avatar: "HM" },
    ],
    relatedIds: ["5", "3"],
  },
  {
    id: "2",
    title: "Bio-202 Midterm",
    dept: "Biology",
    price: 20,
    rating: 4.9,
    purchases: "800",
    year: "2023/2024",
    duration: "2 hours",
    questions: 45,
    difficulty: "Advanced",
    instructor: "Prof. Sara Girma",
    description:
      "In-depth midterm covering cell biology, genetics, and molecular biology. Carefully curated from past papers with verified answers by faculty members.",
    topics: [
      "Cell Biology & Structure",
      "Genetics & Heredity",
      "Molecular Biology",
      "Protein Synthesis",
      "Enzyme Kinetics",
      "Metabolic Pathways",
    ],
    includes: [
      "Full exam paper (PDF + interactive)",
      "Model answers with explanations",
      "AI-powered question walkthroughs",
      "Performance tracker dashboard",
      "Printable study cards",
    ],
    reviews: [
      { name: "Meron K.", rating: 5, comment: "Incredible quality. Really helped me understand molecular pathways.", avatar: "MK" },
      { name: "Daniel F.", rating: 5, comment: "The best exam resource I've found for Biology.", avatar: "DF" },
      { name: "Tigist W.", rating: 4, comment: "Comprehensive and well-explained. Highly recommend.", avatar: "TW" },
    ],
    relatedIds: ["4", "1"],
  },
  {
    id: "3",
    title: "Eng-305 Analysis",
    dept: "Engineering",
    price: 25,
    rating: 4.7,
    purchases: "2.1k",
    year: "2022/2023",
    duration: "3.5 hours",
    questions: 50,
    difficulty: "Advanced",
    instructor: "Dr. Yonas Tesfaye",
    description:
      "Structural and circuit analysis exam covering advanced engineering topics including thermodynamics, mechanics of materials, and electrical circuit design.",
    topics: [
      "Structural Analysis",
      "Thermodynamics",
      "Mechanics of Materials",
      "Electrical Circuit Design",
      "Signal Processing",
      "Control Systems",
    ],
    includes: [
      "Full exam paper (PDF + interactive)",
      "Model answers with explanations",
      "AI-powered question walkthroughs",
      "Performance tracker dashboard",
      "Printable study cards",
    ],
    reviews: [
      { name: "Abel T.", rating: 5, comment: "Extremely detailed. Cleared all my doubts about circuit analysis.", avatar: "AT" },
      { name: "Natnael B.", rating: 4, comment: "Good coverage. The thermodynamics section was spot on.", avatar: "NB" },
      { name: "Kidist A.", rating: 5, comment: "Worth every birr! Passed with distinction.", avatar: "KA" },
    ],
    relatedIds: ["1", "5"],
  },
  {
    id: "4",
    title: "Med-101 Anatomy",
    dept: "Medicine",
    price: 30,
    rating: 5.0,
    purchases: "3.5k",
    year: "2023/2024",
    duration: "4 hours",
    questions: 80,
    difficulty: "Advanced",
    instructor: "Dr. Hiwot Alemu",
    description:
      "The definitive anatomy exam resource for first-year medical students. Covers gross anatomy, histology, and clinical correlations with interactive diagrams.",
    topics: [
      "Gross Anatomy",
      "Histology",
      "Neuroanatomy",
      "Cardiovascular System",
      "Musculoskeletal System",
      "Clinical Correlations",
    ],
    includes: [
      "Full exam paper (PDF + interactive)",
      "Model answers with explanations",
      "AI-powered question walkthroughs",
      "Performance tracker dashboard",
      "Printable study cards",
    ],
    reviews: [
      { name: "Liya G.", rating: 5, comment: "Perfect preparation tool. I got an A on my anatomy final!", avatar: "LG" },
      { name: "Robel M.", rating: 5, comment: "Comprehensive and detailed. The clinical correlations are gold.", avatar: "RM" },
      { name: "Feven H.", rating: 5, comment: "Absolute must-have for med students. Very high quality.", avatar: "FH" },
    ],
    relatedIds: ["2", "6"],
  },
  {
    id: "5",
    title: "Math-201 Calculus",
    dept: "Mathematics",
    price: 18,
    rating: 4.6,
    purchases: "4.2k",
    year: "2022/2023",
    duration: "3 hours",
    questions: 55,
    difficulty: "Intermediate",
    instructor: "Prof. Tamirat Bekele",
    description:
      "Complete calculus exam covering differential and integral calculus, multivariable functions, and series. Includes solved problems for all major theorem applications.",
    topics: [
      "Limits & Continuity",
      "Differential Calculus",
      "Integral Calculus",
      "Multivariable Functions",
      "Series & Sequences",
      "Vector Calculus",
    ],
    includes: [
      "Full exam paper (PDF + interactive)",
      "Model answers with explanations",
      "AI-powered question walkthroughs",
      "Performance tracker dashboard",
      "Printable study cards",
    ],
    reviews: [
      { name: "Etsub K.", rating: 5, comment: "Helped me ace the exam. The step-by-step solutions are very clear.", avatar: "EK" },
      { name: "Biruk T.", rating: 4, comment: "Really good for practice. Covers all key topics.", avatar: "BT" },
      { name: "Mihret A.", rating: 5, comment: "Best math exam resource hands down.", avatar: "MA" },
    ],
    relatedIds: ["1", "3"],
  },
  {
    id: "6",
    title: "Arch-404 Design",
    dept: "Architecture",
    price: 40,
    rating: 4.9,
    purchases: "600",
    year: "2023/2024",
    duration: "5 hours",
    questions: 30,
    difficulty: "Expert",
    instructor: "Arch. Dawit Solomon",
    description:
      "Advanced architectural design exam covering urban planning, structural design principles, sustainable architecture, and design theory. Includes portfolio critique examples.",
    topics: [
      "Urban Planning",
      "Structural Design Principles",
      "Sustainable Architecture",
      "Design Theory & History",
      "Building Technology",
      "Environmental Systems",
    ],
    includes: [
      "Full exam paper (PDF + interactive)",
      "Model answers with explanations",
      "AI-powered question walkthroughs",
      "Performance tracker dashboard",
      "Printable study cards",
    ],
    reviews: [
      { name: "Saron B.", rating: 5, comment: "Outstanding depth. Exactly what fourth-year students need.", avatar: "SB" },
      { name: "Yared T.", rating: 5, comment: "Well-curated. The design theory section is exceptional.", avatar: "YT" },
      { name: "Meseret W.", rating: 4, comment: "Great resource for the final studio project too.", avatar: "MW" },
    ],
    relatedIds: ["4", "3"],
  },
];

const ALL_EXAMS_MAP = Object.fromEntries(EXAMS.map((e) => [e.id, e]));

const DIFFICULTY_COLOR: Record<string, string> = {
  Intermediate: "bg-blue-500/10 text-blue-600 border-blue-200",
  Advanced: "bg-orange-500/10 text-orange-600 border-orange-200",
  Expert: "bg-red-500/10 text-red-600 border-red-200",
};

export async function loader({ params }: Route.LoaderArgs) {
  const exam = ALL_EXAMS_MAP[params.id];
  if (!exam) throw new Response("Not Found", { status: 404 });
  const related = exam.relatedIds.map((rid) => ALL_EXAMS_MAP[rid]).filter(Boolean);
  return { exam, related };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Exam Not Found – UniExam Hub" }];
  return [
    { title: `${data.exam.title} – UniExam Hub` },
    { name: "description", content: data.exam.description },
  ];
}

export default function ExamDetail() {
  const { exam, related } = useLoaderData<typeof loader>();
  const diffClass = DIFFICULTY_COLOR[exam.difficulty] ?? "bg-muted text-muted-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 size-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          {/* Back link */}
          <Link
            to="/exams"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Available Exams
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left – Exam Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="secondary" className="uppercase tracking-wider text-xs font-bold px-3 py-1">
                  {exam.dept}
                </Badge>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${diffClass}`}>
                  {exam.difficulty}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Academic Year {exam.year}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                {exam.title}
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {exam.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star className="size-4 fill-yellow-400 stroke-yellow-500" />
                  <span className="text-foreground font-bold">{exam.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4 text-primary" />
                  <span className="text-foreground font-bold">{exam.purchases}</span>
                  <span>purchases</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 text-primary" />
                  <span className="text-foreground font-bold">{exam.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="size-4 text-primary" />
                  <span className="text-foreground font-bold">{exam.questions}</span>
                  <span>questions</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Prepared by <span className="font-semibold text-foreground">{exam.instructor}</span>
              </p>
            </div>

            {/* Right – Purchase Card (desktop) */}
            <div className="hidden lg:block">
              <PurchaseCard exam={exam} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="container mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-12">

          {/* Topics Covered */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="size-4 text-primary" />
              </div>
              Topics Covered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exam.topics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 transition-colors"
                >
                  <CheckCircle className="size-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="size-4 text-primary" />
              </div>
              What's Included
            </h2>
            <div className="space-y-3">
              {exam.includes.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-card"
                >
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Download className="size-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="size-4 text-primary" />
              </div>
              Student Reviews
            </h2>

            {/* Rating summary */}
            <div className="flex items-center gap-6 p-6 rounded-2xl border bg-card mb-6">
              <div className="text-center">
                <p className="text-5xl font-black text-primary">{exam.rating}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-4 ${s <= Math.round(exam.rating) ? "fill-yellow-400 stroke-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">out of 5</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-4 text-right">{star}</span>
                    <Star className="size-3 fill-yellow-400 stroke-yellow-500 text-yellow-500 shrink-0" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: star === 5 ? "75%" : star === 4 ? "20%" : "5%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {exam.reviews.map((review) => (
                <Card key={review.name} className="border-border">
                  <CardContent className="flex gap-4 pt-6">
                    <div className="size-10 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{review.name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="size-3.5 fill-yellow-400 stroke-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sticky column */}
        <div className="space-y-6">
          {/* Purchase card (mobile) */}
          <div className="lg:hidden">
            <PurchaseCard exam={exam} />
          </div>

          {/* Guarantees */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" /> Our Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              {[
                "Verified by faculty members",
                "30-day money-back guarantee",
                "Lifetime access after purchase",
                "Free updates when new papers are added",
              ].map((g) => (
                <div key={g} className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-primary shrink-0" />
                  <span>{g}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Tutor Promo */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-5 text-primary" />
                <p className="font-bold text-sm">AI Tutor Included</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Get instant AI explanations for every question. Ask follow-up questions and understand solutions deeply.
              </p>
            </CardContent>
          </Card>

          {/* Related Exams */}
          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Exams</h3>
              <div className="space-y-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/exams/${rel.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{rel.title}</p>
                      <p className="text-xs text-muted-foreground">{rel.dept}</p>
                    </div>
                    <span className="text-primary font-black text-sm shrink-0 ml-2">${rel.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Extracted Purchase Card ──────────────────────────────────────────────────
function PurchaseCard({ exam }: { exam: (typeof EXAMS)[number] }) {
  return (
    <div className="rounded-2xl border bg-card shadow-xl p-6 space-y-5 sticky top-6">
      <div className="flex items-baseline justify-between">
        <span className="text-4xl font-black text-primary">${exam.price}</span>
        <span className="text-sm text-muted-foreground line-through">${Math.round(exam.price * 1.4)}</span>
      </div>

      <div className="space-y-3">
        <Link to={`/exams/${exam.id}/checkout`} id={`purchase-exam-${exam.id}`} className="block w-full">
          <Button size="lg" className="w-full font-bold text-base">
            Purchase Access
          </Button>
        </Link>
        <Link to={`/exams/${exam.id}/preview`} id={`preview-exam-${exam.id}`} className="block w-full">
          <Button variant="outline" size="lg" className="w-full font-bold text-base">
            Preview Free Questions
          </Button>
        </Link>
      </div>

      <div className="border-t border-border pt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Format</span>
          <span className="text-foreground font-medium">PDF + Interactive</span>
        </div>
        <div className="flex justify-between">
          <span>Questions</span>
          <span className="text-foreground font-medium">{exam.questions}</span>
        </div>
        <div className="flex justify-between">
          <span>Duration</span>
          <span className="text-foreground font-medium">{exam.duration}</span>
        </div>
        <div className="flex justify-between">
          <span>Access</span>
          <span className="text-foreground font-medium">Lifetime</span>
        </div>
        <div className="flex justify-between">
          <span>Language</span>
          <span className="text-foreground font-medium">English / Amharic</span>
        </div>
      </div>
    </div>
  );
}
