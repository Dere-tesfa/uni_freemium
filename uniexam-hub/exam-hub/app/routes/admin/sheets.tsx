// Admin Sheets Management Route

import {
  requireAdmin,
  getFormData,
  jsonResponse,
  errorResponse,
} from "~/lib/middleware";
import { sheetService } from "~/services";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// Loader: Fetch all sheets
export async function loader({ request }: { request: Request }) {
  // Authentication check removed for testing

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const department = url.searchParams.get("department") || "";
  const published = url.searchParams.get("published") || "";

  let sheets;
  if (search) {
    sheets = await sheetService.searchSheets(search);
  } else {
    const filters: any = {};
    if (department) filters.department = department;
    if (published) filters.is_published = published === "true";

    sheets = await sheetService.getAllSheets(filters);
  }

  const departments = await sheetService.getDepartments();
  const universities = await sheetService.getUniversities();

  return { sheets, departments, universities, search, department, published };
}

// Action: Handle sheet operations
export async function action({ request }: { request: Request }) {
  // Authentication check removed for testing

  try {
    const formData = await getFormData(request);
    const action = formData.get("action") as string;
    const sheetId = formData.get("sheetId") as string;

    if (action === "delete" && sheetId) {
      await sheetService.deleteSheet(sheetId);
      return jsonResponse({
        success: true,
        message: "Sheet deleted successfully",
      });
    } else if (action === "toggle-publish" && sheetId) {
      await sheetService.togglePublish(sheetId);
      return jsonResponse({ success: true, message: "Sheet status updated" });
    } else if (action === "duplicate" && sheetId) {
      const newSheet = await sheetService.duplicateSheet(sheetId);
      return jsonResponse({
        success: true,
        message: "Sheet duplicated successfully",
        sheet: newSheet,
      });
    } else if (action === "create") {
      const title = formData.get("title") as string;
      const courseCode = formData.get("courseCode") as string;
      const university = formData.get("university") as string;
      const department = formData.get("department") as string;
      const year = parseInt(formData.get("year") as string);
      const price = parseInt(formData.get("price") as string);
      const description = formData.get("description") as string;

      const sheet = await sheetService.createSheet({
        title,
        course_code: courseCode,
        university,
        department,
        year,
        price,
        description,
        is_published: false,
      });

      return jsonResponse({
        success: true,
        message: "Sheet created successfully",
        sheet,
      });
    }

    return errorResponse("Invalid action", 400);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export default function AdminSheets({
  loaderData,
  actionData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
  actionData?: any;
}) {
  const { sheets, departments, universities, search, department, published } =
    loaderData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sheets Management</h1>
          <p className="text-muted-foreground">
            Manage exam sheets and questions
          </p>
        </div>
        <Button
          onClick={() => {
            // Open create sheet modal
            const modal = document.getElementById("create-sheet-modal");
            if (modal) modal.style.display = "block";
          }}
        >
          Create New Sheet
        </Button>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="grid gap-4 md:grid-cols-4">
            <Input
              type="text"
              name="search"
              placeholder="Search sheets..."
              defaultValue={search}
            />
            <select
              name="department"
              className="rounded-md border px-3 py-2"
              defaultValue={department}
            >
              <option value="">All Departments</option>
              {departments.map((dept: string) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              name="published"
              className="rounded-md border px-3 py-2"
              defaultValue={published}
            >
              <option value="">All Status</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Filter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = "/admin/sheets")}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sheets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sheets.filter((s: any) => s.is_published).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unpublished</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {sheets.filter((s: any) => !s.is_published).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Free Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sheets.filter((s: any) => s.price === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sheets List */}
      <Card>
        <CardHeader>
          <CardTitle>All Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          {sheets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No sheets found
            </p>
          ) : (
            <div className="space-y-4">
              {sheets.map((sheet: any) => (
                <div
                  key={sheet.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{sheet.title}</p>
                      <Badge
                        variant={sheet.is_published ? "default" : "secondary"}
                      >
                        {sheet.is_published ? "Published" : "Draft"}
                      </Badge>
                      {sheet.price === 0 && (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sheet.course_code} • {sheet.department} •{" "}
                      {sheet.university}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Year: {sheet.year}</span>
                      <span>Price: {sheet.price} ETB</span>
                      <span>
                        Created:{" "}
                        {new Date(sheet.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `/admin/sheets/${sheet.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <form method="post">
                      <input
                        type="hidden"
                        name="action"
                        value="toggle-publish"
                      />
                      <input type="hidden" name="sheetId" value={sheet.id} />
                      <Button type="submit" size="sm" variant="outline">
                        {sheet.is_published ? "Unpublish" : "Publish"}
                      </Button>
                    </form>
                    <form method="post">
                      <input type="hidden" name="action" value="duplicate" />
                      <input type="hidden" name="sheetId" value={sheet.id} />
                      <Button type="submit" size="sm" variant="outline">
                        Duplicate
                      </Button>
                    </form>
                    <form
                      method="post"
                      onSubmit={(e) => {
                        if (!confirm(`Delete sheet "${sheet.title}"?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="action" value="delete" />
                      <input type="hidden" name="sheetId" value={sheet.id} />
                      <Button type="submit" size="sm" variant="destructive">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Sheet Modal (Simple) */}
      <div
        id="create-sheet-modal"
        style={{ display: "none" }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create New Sheet</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const modal = document.getElementById("create-sheet-modal");
                  if (modal) modal.style.display = "none";
                }}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form method="post" className="space-y-4">
              <input type="hidden" name="action" value="create" />

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input type="text" name="title" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Code
                </label>
                <Input type="text" name="courseCode" required />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    University
                  </label>
                  <Input type="text" name="university" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  <Input type="text" name="department" required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <Input type="number" name="year" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (ETB)
                  </label>
                  <Input type="number" name="price" defaultValue="0" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full rounded-md border px-3 py-2"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Sheet
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
