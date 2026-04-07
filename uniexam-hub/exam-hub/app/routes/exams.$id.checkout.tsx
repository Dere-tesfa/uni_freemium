import { Link, useLoaderData, Form, useNavigate, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/exams.$id.checkout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle,
  Star,
  Zap,
  Gift,
  Upload,
  Phone,
  Building,
  Info,
  Loader2,
} from "lucide-react";
import { 
  requireAuth, 
  getFormData, 
  handleError,
  validateRequired 
} from "~/lib/middleware.server";
import { 
  sheetService, 
  paymentService, 
  settingsService, 
  fileService 
} from "~/services";
import { redirect } from "react-router";

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const exam = await sheetService.getSheetById(params.id!);
  
  if (!exam) {
    throw new Response("Exam Not Found", { status: 404 });
  }

  // Check if user already has access
  const sheetAccess = await sheetService.getSheetWithAccess(exam.id, user.id);
  if (sheetAccess?.has_access) {
    return redirect(`/exams/${exam.id}/preview`);
  }

  // Check if there's a pending purchase
  if (sheetAccess?.purchase && sheetAccess.purchase.status === 'pending') {
    return redirect(`/exams/${exam.id}`);
  }

  const bankAccounts = await settingsService.getBankAccounts();
  const instructions = await settingsService.getPaymentInstructions();

  return { 
    exam, 
    user, 
    bankAccounts, 
    instructions 
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const user = await requireAuth(request);
  
  try {
    const formData = await getFormData(request);
    const paymentMethod = formData.get("payment-method") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const transactionId = formData.get("transactionId") as string;
    const payerPhone = formData.get("payerPhone") as string;

    validateRequired({ firstName, lastName, phone, paymentMethod }, ["firstName", "lastName", "phone", "paymentMethod"]);

    // For TeleBirr, require transaction ID
    if (paymentMethod === "telebirr" && !transactionId) {
      return { error: "Please enter your TeleBirr transaction ID" };
    }

    let screenshotUrl = "";

    // Handle manual payment (TeleBirr / CBE)
    if (paymentMethod === "telebirr" || paymentMethod === "cbebirr") {
      // For CBE, require screenshot upload
      if (paymentMethod === "cbebirr") {
        const screenshot = formData.get("screenshot") as File;
        if (!screenshot || screenshot.size === 0) {
          return { error: "Please upload a payment screenshot for manual verification." };
        }
        const buffer = Buffer.from(await screenshot.arrayBuffer());
        screenshotUrl = await fileService.uploadFile(buffer, screenshot.name, screenshot.type);
      }
    } else if (paymentMethod === "card") {
      // Mock card processing - in production, integrate with Stripe/Chapa
      screenshotUrl = "CARD_PAYMENT_MOCK";
    }

    const purchase = await paymentService.createPaymentRequest({
      user_id: user.id,
      sheet_id: params.id!,
      amount: amount,
      screenshot_url: screenshotUrl || undefined,
      transaction_id: transactionId || undefined,
      payer_phone: payerPhone || undefined,
      status: paymentMethod === "card" ? "approved" : "pending",
    });

    return redirect(`/exams/${params.id}/checkout/success`);

  } catch (error: any) {
    return handleError(error);
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Checkout – UniExam Hub" }];
  return [{ title: `Checkout: ${data.exam.title} – UniExam Hub` }];
}

export default function CheckoutPage() {
  const { exam, user, bankAccounts, instructions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [paymentMethod, setPaymentMethod] = useState("telebirr");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const discountedPrice = Math.round(exam.price * 1.4);
  const savings = discountedPrice - exam.price;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

        {actionData && "error" in actionData && (
          <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
            <Info className="size-5 shrink-0" />
            {actionData.error}
          </div>
        )}

        <Form method="post" encType="multipart/form-data" className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <input type="hidden" name="amount" value={exam.price} />
          
          {/* ── Left: Payment Form ─────────────────────────────── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Order Summary Banner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-black text-xl">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{exam.title}</p>
                <p className="text-xs text-muted-foreground">{exam.department} · Exam Sheet</p>
              </div>
              <span className="text-xl font-black text-primary shrink-0">${exam.price}</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    placeholder="Biruk"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    placeholder="Tesfaye"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email || ""}
                    placeholder="biruk@university.edu.et"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    defaultValue={user.phone}
                    placeholder="+251 9XX XXX XXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "telebirr", label: "TeleBirr", emoji: "📱" },
                  { id: "cbebirr",  label: "CBE Birr",  emoji: "🏦" },
                  { id: "card",     label: "Credit Card", emoji: "💳" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.id 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="sr-only"
                    />
                    <span className="text-lg">{method.emoji}</span>
                    <span className="text-sm font-semibold">{method.label}</span>
                    {paymentMethod === method.id && <CheckCircle className="size-4 text-primary ml-auto" />}
                  </label>
                ))}
              </div>

              {/* Dynamic Payment Fields */}
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-6">
                {paymentMethod !== "card" ? (
                  <>
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transfer Details</p>
                      <div className="grid grid-cols-1 gap-4">
                        {bankAccounts.filter(b => 
                          (paymentMethod === "telebirr" && b.name === "Telebirr") || 
                          (paymentMethod === "cbebirr" && (b.name === "Cbe" || b.name === "Commercial Bank Of Ethiopia"))
                        ).map((bank) => (
                          <div key={bank.account_number} className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                {paymentMethod === "telebirr" ? <Phone className="size-5 text-primary" /> : <Building className="size-5 text-primary" />}
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">{bank.name} Account</p>
                                <p className="text-sm font-black font-mono">{bank.account_number}</p>
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs font-bold"
                              onClick={() => {
                                navigator.clipboard.writeText(bank.account_number);
                                alert("Account number copied!");
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transaction Number - TeleBirr Only */}
                    {paymentMethod === "telebirr" && (
                      <div className="space-y-4">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">TeleBirr Transaction</p>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            After sending payment via TeleBirr, enter your transaction reference number below.
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium">TeleBirr Transaction ID</label>
                            <input
                              name="transactionId"
                              type="text"
                              required={paymentMethod === "telebirr"}
                              placeholder="e.g., TN123456789"
                              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition text-sm font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium">Your Phone Number (used for payment)</label>
                            <input
                              name="payerPhone"
                              type="tel"
                              required={paymentMethod === "telebirr"}
                              placeholder="+251 9XX XXX XXX"
                              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Payment Proof</p>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground italic">
                          {instructions}
                        </p>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-8 hover:border-primary/50 transition-colors relative cursor-pointer group bg-background">
                          <input
                            type="file"
                            name="screenshot"
                            accept="image/*"
                            required={paymentMethod === "cbebirr"}
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          {screenshotPreview ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                              <img src={screenshotPreview} alt="Preview" className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs font-bold flex items-center gap-2">
                                  <Upload className="size-4" /> Change Image
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-2">
                              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="size-6 text-primary" />
                              </div>
                              <p className="text-sm font-bold">Click or drag to upload screenshot</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Card Details</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="1234  5678  9012  3456"
                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition text-sm font-mono"
                          />
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">CVV</label>
                          <input
                            type="text"
                            placeholder="• • •"
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full h-14 text-base font-bold gap-2 rounded-2xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="size-5" />
                    Complete Secure Payment — ${exam.price}
                  </>
                )}
              </Button>
            </div>

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
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-base">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original price</span>
                  <span className="line-through text-muted-foreground">${discountedPrice}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1.5 font-medium"><Gift className="size-3.5" /> Special Discount</span>
                  <span>−${savings}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-black text-xl">
                  <span>Total</span>
                  <span className="text-primary">${exam.price}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-muted-foreground pt-2 leading-tight">
                <Zap className="size-3 text-primary shrink-0 mt-0.5" />
                <span>Access is granted instantly for card payments, or within 24h for TeleBirr/CBE verification.</span>
              </div>
            </div>

            {/* Safety Badge */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ShieldCheck className="size-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Secure Verification</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">100% Protected</p>
                  </div>
               </div>
               <div className="space-y-2">
                  {[
                    "30-day money-back guarantee",
                    "Lifetime access to content",
                    "Secure payment processing"
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="size-3 text-primary" />
                      {item}
                    </div>
                  ))}
               </div>
            </div>

            {/* Help box */}
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
               <p className="text-xs font-bold mb-2">Need Help?</p>
               <p className="text-xs text-muted-foreground mb-4">If you encounter any issues during payment, please contact our 24/7 support team.</p>
               <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs font-bold">
                 Chat with Support
               </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
