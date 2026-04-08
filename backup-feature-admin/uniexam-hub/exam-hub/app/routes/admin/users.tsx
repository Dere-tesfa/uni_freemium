// Admin Users Management Route

import { userService } from "~/services";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// Loader: Fetch all users
export async function loader({ request }: { request: Request }) {
  // Authentication check removed for testing

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  let users;
  if (search) {
    users = await userService.searchUsers(search);
  } else {
    users = await userService.getAllUsers();
  }

  return { users, search };
}

// Action: Handle user operations
export async function action({ request }: { request: Request }) {
  const { getFormData, jsonResponse, errorResponse } = await import("~/lib/middleware.server");

  try {
    const formData = await getFormData(request);
    const action = formData.get("action") as string;
    const userId = formData.get("userId") as string;

    if (!userId) {
      return errorResponse("User ID is required", 400);
    }

    if (action === "delete") {
      await userService.deleteUser(userId);
      return jsonResponse({
        success: true,
        message: "User deleted successfully",
      });
    } else if (action === "grant-access") {
      const sheetId = formData.get("sheetId") as string;
      if (!sheetId) {
        return errorResponse("Sheet ID is required", 400);
      }
      await userService.grantSheetAccess(userId, sheetId);
      return jsonResponse({
        success: true,
        message: "Access granted successfully",
      });
    } else if (action === "revoke-access") {
      const sheetId = formData.get("sheetId") as string;
      if (!sheetId) {
        return errorResponse("Sheet ID is required", 400);
      }
      await userService.revokeSheetAccess(userId, sheetId);
      return jsonResponse({
        success: true,
        message: "Access revoked successfully",
      });
    } else if (action === "reset-password") {
      const newPassword = formData.get("newPassword") as string;
      if (!newPassword) {
        return errorResponse("New password is required", 400);
      }
      await userService.resetPassword(userId, newPassword);
      return jsonResponse({
        success: true,
        message: "Password reset successfully",
      });
    }

    return errorResponse("Invalid action", 400);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export default function AdminUsers({
  loaderData,
  actionData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
  actionData?: any;
}) {
  const { users, search } = loaderData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage registered users and their access
        </p>
      </div>

      {/* Action Feedback */}
      {actionData?.success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {actionData.message}
        </div>
      )}

      {actionData?.error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {actionData.error}
        </div>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-2">
            <Input
              type="text"
              name="search"
              placeholder="Search by phone or email..."
              defaultValue={search}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
            {search && (
              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = "/admin/users")}
              >
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u: any) => u.role === "student").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u: any) => u.role === "admin").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No users found
            </p>
          ) : (
            <div className="space-y-4">
              {users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.phone}</p>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                    {user.email && (
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const userId = user.id;
                        window.location.href = `/admin/users/${userId}`;
                      }}
                    >
                      View Details
                    </Button>
                    {user.role !== "admin" && (
                      <form
                        method="post"
                        onSubmit={(e) => {
                          if (!confirm(`Delete user ${user.phone}?`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="userId" value={user.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
