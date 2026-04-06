import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/exams.$id.checkout.success";
import { Button } from "../components/ui/button";
import { CheckCircle, BookOpen, Sparkles, ArrowRight, Download } from "lucide-react";

const EXAMS: Record<string, { id: string; title: string; dept: string; price: number }> = {
  "1": { id: "1", title: "CS-101 Final Exam",    dept: "Computer Science", price: 15 },
  "2": { id: "2", title: "Bio-202 Midterm",       dept: "Biology",          price: 20 },
  "3": { id: "3", title: "Eng-305 Analysis",      dept: "Engineering",      price: 25 },
  "4": { id: "4", title: "Med-101 Anatomy",       dept: "Medicine",         price: 30 },
  "5": { id: "5", title: "Math-201 Calculus",     dept: "Mathematics",      price: 18 },
  "6": { id: "6", title: "Arch-404 Design",       dept: "Architecture",     price: 40 },
};

export async function loader({ params }: Route.LoaderArgs) {
  const exam = EXAMS[params.id];
  if (!exam) throw new Response("Not Found", { status: 404 });
  return { exam };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Purchase Successful – UniExam Hub" }];
  return [{ title: `Access Granted: ${data.exam.title} – UniExam Hub` }];
}

export default function CheckoutSuccessPage() {
  const { exam } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Success icon */}
        <div className="relative inline-flex">
          <div className="size-28 rounded-full bg-green-500/10 flex items-center justify-center">
            <div className="size-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="size-12 text-green-500" strokeWidth={1.5} />
            </div>
          </div>
          {/* Sparkle decorations */}
          <Sparkles className="absolute -top-2 -right-2 size-6 text-primary" />
          <Sparkles className="absolute -bottom-1 -left-3 size-4 text-yellow-500" />
        </div>

        {/* Message */}
        <div>
          <h1 className="text-4xl font-black mb-3">Payment Successful! 🎉</h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            You now have <strong className="text-foreground">lifetime access</strong> to{" "}
            <strong className="text-primary">{exam.title}</strong>.
            A download link has been sent to your email.
          </p>
        </div>

        {/* Order card */}
        <div className="rounded-2xl border border-border bg-card p-6 text-left space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Summary</p>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-black text-xl">U</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{exam.title}</p>
              <p className="text-xs text-muted-foreground">{exam.dept} · Lifetime Access</p>
            </div>
            <span className="font-black text-primary">${exam.price}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-bold text-foreground">UEH-{exam.id}{Date.now().toString().slice(-6)}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            id="access-download-btn"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Download className="size-5 text-primary" />
            </div>
            <span className="text-xs font-semibold">Download PDF</span>
          </button>
          <Link
            id="access-start-exam-btn"
            to={`/exams/${exam.id}/preview`}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BookOpen className="size-5 text-primary" />
            </div>
            <span className="text-xs font-semibold">Start Exam</span>
          </Link>
          <button
            id="access-ai-tutor-btn"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sparkles className="size-5 text-primary" />
            </div>
            <span className="text-xs font-semibold">AI Tutor</span>
          </button>
        </div>

        {/* Back to exams */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/exams">
            <Button variant="outline" size="lg" className="px-8 font-bold">
              Browse More Exams
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" className="px-8 font-bold gap-2">
              Go Home <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
