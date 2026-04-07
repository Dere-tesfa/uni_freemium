import { Link, useLoaderData, Form } from "react-router";
import type { Route } from "./+types/exams.$id.checkout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle,
  Star,
  Zap,
  Gift,
} from "lucide-react";

// ── Shared exam data (same source as detail page) ───────────────────────────
const EXAMS: Record<string, { id: string; title: string; dept: string; price: number; rating: number; purchases: string; questions: number; duration: string }> = {
  "1": { id: "1", title: "CS-101 Final Exam",    dept: "Computer Science", price: 15, rating: 4.8, purchases: "1.2k", questions: 60, duration: "3 hours" },
  "2": { id: "2", title: "Bio-202 Midterm",       dept: "Biology",          price: 20, rating: 4.9, purchases: "800",  questions: 45, duration: "2 hours" },
  "3": { id: "3", title: "Eng-305 Analysis",      dept: "Engineering",      price: 25, rating: 4.7, purchases: "2.1k", questions: 50, duration: "3.5 hours" },
  "4": { id: "4", title: "Med-101 Anatomy",       dept: "Medicine",         price: 30, rating: 5.0, purchases: "3.5k", questions: 80, duration: "4 hours" },
  "5": { id: "5", title: "Math-201 Calculus",     dept: "Mathematics",      price: 18, rating: 4.6, purchases: "4.2k", questions: 55, duration: "3 hours" },
  "6": { id: "6", title: "Arch-404 Design",       dept: "Architecture",     price: 40, rating: 4.9, purchases: "600",  questions: 30, duration: "5 hours" },
};

export async function loader({ params }: Route.LoaderArgs) {
  const exam = EXAMS[params.id];
  if (!exam) throw new Response("Not Found", { status: 404 });
  return { exam };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Checkout – UniExam Hub" }];
  return [{ title: `Checkout: ${data.exam.title} – UniExam Hub` }];
}

export default function CheckoutPage() {
  const { exam } = useLoaderData<typeof loader>();
  const discountedPrice = Math.round(exam.price * 1.4);
  const savings = discountedPrice - exam.price;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/exams/${exam.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Exam
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4 text-primary" />
            <span className="font-medium">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-black mb-10">Complete Your Purchase</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left: Payment Form ─────────────────────────────── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Order Summary Banner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-black text-xl">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{exam.title}</p>
                <p className="text-xs text-muted-foreground">{exam.dept} · {exam.questions} questions · {exam.duration}</p>
              </div>
              <span className="text-xl font-black text-primary shrink-0">${exam.price}</span>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">First Name</label>
                    <input
                      id="checkout-first-name"
                      type="text"
                      placeholder="Biruk"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Last Name</label>
                    <input
                      id="checkout-last-name"
                      type="text"
                      placeholder="Tesfaye"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    id="checkout-email"
                    type="email"
                    placeholder="biruk@university.edu.et"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    placeholder="+251 9XX XXX XXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { id: "telebirr", label: "TeleBirr", emoji: "📱" },
                  { id: "cbebirr",  label: "CBE Birr",  emoji: "🏦" },
                  { id: "card",     label: "Credit Card", emoji: "💳" },
                ].map((method) => (
                  <label
                    key={method.id}
                    htmlFor={`payment-${method.id}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      id={`payment-${method.id}`}
                      name="payment-method"
                      defaultChecked={method.id === "telebirr"}
                      className="accent-primary"
                    />
                    <span className="text-lg">{method.emoji}</span>
                    <span className="text-sm font-semibold">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Card fields (shown for card selection, always visible for demo) */}
              <div className="space-y-4 p-5 rounded-2xl border border-border bg-card">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      id="checkout-card-number"
                      type="text"
                      placeholder="1234  5678  9012  3456"
                      maxLength={19}
                      className="w-full px-4 py-2.5 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm font-mono"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
                    <input
                      id="checkout-expiry"
                      type="text"
                      placeholder="MM / YY"
                      maxLength={7}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">CVV</label>
                    <input
                      id="checkout-cvv"
                      type="text"
                      placeholder="• • •"
                      maxLength={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name on Card</label>
                  <input
                    id="checkout-card-name"
                    type="text"
                    placeholder="BIRUK TESFAYE"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Link to={`/exams/${exam.id}/checkout/success`} id="checkout-pay-btn">
              <Button size="lg" className="w-full h-14 text-base font-bold gap-2 rounded-2xl">
                <Lock className="size-5" />
                Pay ${exam.price} — Get Instant Access
              </Button>
            </Link>

            <p className="text-center text-xs text-muted-foreground">
              By completing your purchase, you agree to our{" "}
              <Link to="#" className="underline hover:text-primary">Terms of Service</Link>
              {" "}and{" "}
              <Link to="#" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
          </div>

          {/* ── Right: Order Summary ───────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Price breakdown */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-bold text-base">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original price</span>
                  <span className="line-through text-muted-foreground">${discountedPrice}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1.5"><Gift className="size-3.5" /> Discount</span>
                  <span>−${savings}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-black text-base">
                  <span>Total</span>
                  <span className="text-primary">${exam.price}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Zap className="size-3.5 text-primary shrink-0" />
                <span>Instant access immediately after payment</span>
              </div>
            </div>

            {/* Rating */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`size-4 ${s <= Math.round(exam.rating) ? "fill-yellow-400 stroke-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="font-bold">{exam.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">{exam.purchases} students already purchased this exam</p>
            </div>

            {/* Security badges */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              {[
                { icon: ShieldCheck, text: "SSL encrypted & 100% secure" },
                { icon: CheckCircle, text: "30-day money-back guarantee" },
                { icon: Lock,        text: "Your data is never shared" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="size-4 text-primary shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Accepted payments */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Accepted Payments</p>
              <div className="flex flex-wrap gap-2">
                {["TeleBirr", "CBE Birr", "Visa", "Mastercard", "Awash Bank"].map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
