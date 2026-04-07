// Admin Login Page

import { useState } from "react";
import { redirect } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { authService } from "~/services";
import { seedAdminUser } from "~/lib/seed-admin";

export function loader() {
  seedAdminUser().catch(console.error);
  return null;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  try {
    const result = await authService.login({ phone, password });

    // Check if user is admin
    if (result.user.role !== "admin") {
      return {
        error: "Access denied. Admin privileges required.",
      };
    }

    // Create session with token
    const session = await import("~/lib/session.server").then(m => m.getSession());
    session.set("token", result.token);

    return redirect("/admin", {
      headers: {
        "Set-Cookie": await import("~/lib/session.server").then(m => m.commitSession(session)),
      },
    });
  } catch (error: any) {
    return {
      error: error.message || "Login failed",
    };
  }
}

export default function AdminLogin({ actionData }: { actionData?: any }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="size-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-black text-3xl">
                U
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Enter your credentials to access the admin panel
          </p>
        </CardHeader>
        <CardContent>
          {actionData?.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-sm">
              {actionData.error}
            </div>
          )}

          <form method="post" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone"
                placeholder="+251912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ethiopian format: +251XXXXXXXXX
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Login to Admin Panel
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Back to main site
            </a>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted">
            <p className="text-xs font-semibold mb-2">
              Demo Admin Credentials:
            </p>
            <p className="text-xs text-muted-foreground">
              Phone: +251912345678
              <br />
              Password: admin123
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Note: You need to create an admin user first using the auth
              service
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
