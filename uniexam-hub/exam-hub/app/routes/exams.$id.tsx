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

import { sheetService } from "~/services";
import { getAuthUser } from "~/lib/middleware.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await getAuthUser(request);
  const exam = await sheetService.getSheetWithAccess(params.id, user?.id);
  
  if (!exam) throw new Response("Not Found", { status: 404 });
  
  const allExams = await sheetService.getPublishedSheets();
  const related = allExams.filter(e => e.id !== exam.id && e.department === exam.department).slice(0, 3);
  
  return { exam, related };
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Intermediate: "bg-blue-500/10 text-blue-600 border-blue-200",
  Advanced: "bg-orange-500/10 text-orange-600 border-orange-200",
  Expert: "bg-red-500/10 text-red-600 border-red-200",
};

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Exam Not Found – UniExam Hub" }];
  return [
    { title: `${data.exam.title} – UniExam Hub` },
    { name: "description", content: data.exam.description || "" },
  ];
}

export default function ExamDetail() {
  const { exam, related } = useLoaderData<typeof loader>();

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
                  {exam.department}
                </Badge>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border bg-blue-500/10 text-blue-600 border-blue-200`}>
                  University Level
                </span>
                <span className="text-xs text-muted-foreground font-medium">Academic Year {exam.year}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                {exam.title}
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {exam.description || "Comprehensive university past exam with detailed solutions and AI explanations."}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star className="size-4 fill-yellow-400 stroke-yellow-500" />
                  <span className="text-foreground font-bold">4.8</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4 text-primary" />
                  <span className="text-foreground font-bold">Verified</span>
                  <span>exam</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 text-primary" />
                  <span className="text-foreground font-bold">3 hours</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="size-4 text-primary" />
                  <span className="text-foreground font-bold">60+</span>
                  <span>questions</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                University: <span className="font-semibold text-foreground">{exam.university}</span>
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

          {/* Topics Covered (Placeholder for now) */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="size-4 text-primary" />
              </div>
              Topics Covered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Full Exam Content", "Detailed Solutions", "AI Explanations", "Model Answers"].map((topic) => (
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
              {["Interactive Exam Access", "Printable Solutions PDF", "AI Question Walkthroughs", "Performance Analysis Dashboard"].map((item) => (
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

          {/* Student Reviews (Placeholder) */}
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
                <p className="text-5xl font-black text-primary">4.8</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-4 ${s <= 4 ? "fill-yellow-400 stroke-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
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
                        style={{ width: star === 5 ? "85%" : star === 4 ? "12%" : "3%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground italic py-8 border rounded-xl bg-muted/30">
                Purchase this exam to be among the first to review it! Verified students will see actual reviews here.
            </p>
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
                      <p className="text-xs text-muted-foreground">{rel.department}</p>
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
function PurchaseCard({ exam }: { exam: any }) {
  return (
    <div className="rounded-2xl border bg-card shadow-xl p-6 space-y-5 sticky top-6">
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col">
            <span className="text-4xl font-black text-primary">{exam.price} ETB</span>
            <span className="text-xs text-muted-foreground uppercase font-bold mt-1">One-time payment</span>
        </div>
        <span className="text-sm text-muted-foreground line-through">{Math.round(exam.price * 1.4)} ETB</span>
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
          <span className="text-foreground font-medium">60+ Total</span>
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
