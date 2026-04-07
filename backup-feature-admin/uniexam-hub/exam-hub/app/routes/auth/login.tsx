import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../../lib/zod-schemas";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Link, useFetcher, useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import { useEffect } from "react";

import { commitSession, getSession } from "../../lib/session.server";
import { authService } from "../../services/auth.service";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirect = formData.get("redirect") || "/";

  // Server-side validation with Zod
  const result = loginSchema.safeParse({ email, password });
  
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    const authResponse = await authService.login({ phone: result.data.email, password: result.data.password });
    const session = await getSession(request.headers.get("Cookie"));
    // Store token without any prefix
    session.set("token", authResponse.token);
    
    return Response.json({ success: true, redirect }, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return { errors: { general: ["Invalid email or password."] } };
  }
}

export default function Login() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSubmitting = fetcher.state === "submitting";
  const redirect = searchParams.get("redirect") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (fetcher.data?.success) {
      const target = (fetcher.data as any).redirect || "/";
      window.location.href = target;
    }
  }, [fetcher.data]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md p-8 border bg-card rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-primary">Welcome Back</h1>
        <p className="text-muted-foreground mb-8 text-sm">Sign in to access your dashboard and exams.</p>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="name@university.edu"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          {fetcher.data?.errors && (
             <p className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded">
               Invalid email or password. Please try again.
             </p>
          )}

          <Button 
            type="submit" 
            className="w-full py-6 text-lg" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </fetcher.Form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
