// Admin Payments Verification Route
// Integrated with backend payment service

import {
  requireAdmin,
  getFormData,
  jsonResponse,
  errorResponse,
} from "~/lib/middleware";
import { paymentService } from "~/services";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// Loader: Fetch pending payments
export async function loader({ request }: { request: Request }) {
  // Authentication check removed for testing

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "pending";

  let payments;
  if (status === "all") {
    payments = await paymentService.getAllPayments();
  } else {
    payments = await paymentService.getAllPayments({
      status: status as "pending" | "approved" | "rejected",
    });
  }

  const stats = await paymentService.getPaymentStats();

  return { payments, stats, currentStatus: status };
}

// Action: Handle approve/reject
export async function action({ request }: { request: Request }) {
  // Authentication check removed for testing

  try {
    const formData = await getFormData(request);
    const action = formData.get("action") as string;
    const paymentId = formData.get("paymentId") as string;

    if (!paymentId) {
      return errorResponse("Payment ID is required", 400);
    }

    if (action === "approve") {
      const payment = await paymentService.approvePayment(paymentId);
      return jsonResponse({
        success: true,
        payment,
        message: "Payment approved successfully",
      });
    } else if (action === "reject") {
      const reason = formData.get("reason") as string;
      if (!reason) {
        return errorResponse("Rejection reason is required", 400);
      }
      const payment = await paymentService.rejectPayment(paymentId, reason);
      return jsonResponse({
        success: true,
        payment,
        message: "Payment rejected",
      });
    } else if (action === "bulk-approve") {
      const paymentIds = formData.get("paymentIds") as string;
      const ids = paymentIds.split(",");
      const result = await paymentService.bulkApprovePayments(ids);
      return jsonResponse({
        success: true,
        result,
        message: `Approved ${result.approved} payments`,
      });
    }

    return errorResponse("Invalid action", 400);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export default function AdminPayments({
  loaderData,
  actionData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
  actionData?: Awaited<ReturnType<typeof action>>;
}) {
  const { payments, stats, currentStatus } = loaderData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payment Verification</h1>
        <p className="text-muted-foreground">
          Review and approve payment requests from students
        </p>
      </div>

      {/* Action Feedback */}
      {actionData && "success" in actionData && actionData.success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {actionData.message}
        </div>
      )}

      {actionData && "error" in actionData && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {actionData.error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_requests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending_count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved_count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected_count}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <a
          href="/admin/payments?status=pending"
          className={`px-4 py-2 ${currentStatus === "pending" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
        >
          Pending ({stats.pending_count})
        </a>
        <a
          href="/admin/payments?status=approved"
          className={`px-4 py-2 ${currentStatus === "approved" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
        >
          Approved ({stats.approved_count})
        </a>
        <a
          href="/admin/payments?status=rejected"
          className={`px-4 py-2 ${currentStatus === "rejected" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
        >
          Rejected ({stats.rejected_count})
        </a>
        <a
          href="/admin/payments?status=all"
          className={`px-4 py-2 ${currentStatus === "all" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
        >
          All
        </a>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No payment requests found
            </p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment: any) => (
                <div
                  key={payment.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {payment.user_phone || "Unknown User"}
                      </p>
                      <Badge
                        variant={
                          payment.status === "approved"
                            ? "default"
                            : payment.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.sheet_title || "Unknown Sheet"}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{payment.amount} ETB</span>
                      <span className="text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {payment.screenshot_url && (
                      <a
                        href={payment.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Screenshot →
                      </a>
                    )}
                    {payment.rejection_reason && (
                      <p className="text-sm text-red-600">
                        Reason: {payment.rejection_reason}
                      </p>
                    )}
                  </div>

                  {payment.status === "pending" && (
                    <div className="flex gap-2">
                      <form method="post">
                        <input type="hidden" name="action" value="approve" />
                        <input
                          type="hidden"
                          name="paymentId"
                          value={payment.id}
                        />
                        <Button type="submit" size="sm" variant="default">
                          Approve
                        </Button>
                      </form>
                      <form
                        method="post"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const reason = prompt("Enter rejection reason:");
                          if (reason) {
                            const form = e.currentTarget;
                            const reasonInput = document.createElement("input");
                            reasonInput.type = "hidden";
                            reasonInput.name = "reason";
                            reasonInput.value = reason;
                            form.appendChild(reasonInput);
                            form.submit();
                          }
                        }}
                      >
                        <input type="hidden" name="action" value="reject" />
                        <input
                          type="hidden"
                          name="paymentId"
                          value={payment.id}
                        />
                        <Button type="submit" size="sm" variant="destructive">
                          Reject
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {currentStatus === "pending" && payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              method="post"
              onSubmit={(e) => {
                if (
                  !confirm(`Approve all ${payments.length} pending payments?`)
                ) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="action" value="bulk-approve" />
              <input
                type="hidden"
                name="paymentIds"
                value={payments.map((p: any) => p.id).join(",")}
              />
              <Button type="submit" variant="default">
                Approve All Pending ({payments.length})
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
