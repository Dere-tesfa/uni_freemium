// Admin Dashboard Route
// Integrated with backend services

import { db } from "~/lib/db";
import { paymentService, sheetService } from "~/services";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

import "~/lib/seed-admin";

// Loader: Fetch dashboard data
export async function loader({ request }: { request: Request }) {

  // Fetch dashboard statistics
  const stats = await db.getDashboardStats();
  const paymentStats = await paymentService.getPaymentStats();
  const recentActivity = await paymentService.getRecentActivity(10);
  const pendingPayments = await paymentService.getPendingPayments();
  const popularSheets = await sheetService.getPopularSheets(5);

  return {
    stats,
    paymentStats,
    recentActivity,
    pendingPayments: pendingPayments.slice(0, 5), // Top 5
    popularSheets,
  };
}

export default function AdminDashboard({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const {
    stats,
    paymentStats,
    recentActivity,
    pendingPayments,
    popularSheets,
  } = loaderData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_revenue} ETB</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthly_revenue} ETB this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_payments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sheets</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_sheets}</div>
            <p className="text-xs text-muted-foreground">
              Published exam sheets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity: any) => (
                  <div
                    key={activity.payment.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user_phone} • {activity.sheet_title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {activity.payment.amount} ETB
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Payments</CardTitle>
              <a
                href="/admin/payments"
                className="text-sm text-primary hover:underline"
              >
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending payments
                </p>
              ) : (
                pendingPayments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {payment.user_phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.sheet_title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {payment.amount} ETB
                      </p>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Sheets */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularSheets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sheets available
              </p>
            ) : (
              popularSheets.map((sheet: any) => (
                <div
                  key={sheet.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{sheet.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {sheet.department} • {sheet.university}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {sheet.purchase_count} purchases
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sheet.price === 0 ? "Free" : `${sheet.price} ETB`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Approval Rate
              </p>
              <p className="text-2xl font-bold">
                {paymentStats.approval_rate}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Approval Time
              </p>
              <p className="text-2xl font-bold">
                {paymentStats.average_approval_hours}h
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Payment
              </p>
              <p className="text-2xl font-bold">
                {paymentStats.average_payment} ETB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
