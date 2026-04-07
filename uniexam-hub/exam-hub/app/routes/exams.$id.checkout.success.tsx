import { Link, useLoaderData, redirect } from "react-router";
import type { Route } from "./+types/exams.$id.checkout.success";
import { Button } from "../components/ui/button";
import { CheckCircle, BookOpen, Sparkles, ArrowRight, Download, Clock, Info } from "lucide-react";
import { sheetService } from "~/services";
import { requireAuth } from "~/lib/middleware.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const exam = await sheetService.getSheetWithAccess(params.id!, user.id);
  
  if (!exam) {
    throw new Response("Exam Not Found", { status: 404 });
  }

  // If no purchase found, redirect to checkout
  if (!exam.purchase && exam.price > 0) {
    return redirect(`/exams/${params.id}/checkout`);
  }

  return { exam, user };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Purchase – UniExam Hub" }];
  return [{ title: `Access: ${data.exam.title} – UniExam Hub` }];
}

export default function CheckoutSuccessPage() {
  const { exam, user } = useLoaderData<typeof loader>();
  const isPending = exam.purchase?.status === "pending";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Success icon */}
        <div className="relative inline-flex">
          <div className={`size-28 rounded-full ${isPending ? 'bg-amber-500/10' : 'bg-green-500/10'} flex items-center justify-center`}>
            <div className={`size-20 rounded-full ${isPending ? 'bg-amber-500/20' : 'bg-green-500/20'} flex items-center justify-center`}>
              {isPending ? (
                <Clock className="size-12 text-amber-500" strokeWidth={1.5} />
              ) : (
                <CheckCircle className="size-12 text-green-500" strokeWidth={1.5} />
              )}
            </div>
          </div>
          {/* Sparkle decorations */}
          {!isPending && <Sparkles className="absolute -top-2 -right-2 size-6 text-primary" />}
          {isPending && <Info className="absolute -top-2 -right-2 size-6 text-amber-500" />}
        </div>

        {/* Message */}
        <div>
          <h1 className="text-4xl font-black mb-3">
            {isPending ? "Order Received! ⏳" : "Payment Successful! 🎉"}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {isPending ? (
              <>
                Your payment for <strong className="text-primary">{exam.title}</strong> is being verified. 
                Manual transfers are usually processed within <strong className="text-foreground">2-12 hours</strong>.
              </>
            ) : (
              <>
                You now have <strong className="text-foreground">lifetime access</strong> to{" "}
                <strong className="text-primary">{exam.title}</strong>.
                A confirmation has been sent to your email.
              </>
            )}
          </p>
        </div>

        {/* Order card */}
        <div className="rounded-2xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Summary</p>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-black text-xl">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{exam.title}</p>
              <p className="text-xs text-muted-foreground">{exam.department} · {isPending ? 'Pending Verification' : 'Lifetime Access'}</p>
            </div>
            <div className="text-right">
              <span className="font-black text-primary block">${exam.price}</span>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isPending ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}`}>
                {isPending ? 'Pending' : 'Success'}
              </span>
            </div>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-bold text-foreground">UEH-{exam.id.slice(0,4)}-{exam.purchase?.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        {/* Quick actions - only show if approved */}
        {!isPending && (
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
        )}

        {isPending && (
          <div className="p-5 rounded-2xl bg-muted/30 border border-border text-left">
            <p className="text-sm font-bold flex items-center gap-2 mb-2">
              <Clock className="size-4 text-amber-500" />
              What's next?
            </p>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li>Our admins will verify your transaction screenshot.</li>
              <li>You will receive an SMS and email once access is granted.</li>
              <li>Once approved, you can find this exam in your library.</li>
            </ul>
          </div>
        )}

        {/* Back to exams */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/exams">
            <Button variant="outline" size="lg" className="px-8 font-bold rounded-xl h-12">
              Browse More Exams
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" className="px-8 font-bold gap-2 rounded-xl h-12">
              Go Home <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

