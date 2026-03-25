import { Button } from "../../components/ui/button"
import { Link } from "react-router"

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md p-8 border bg-card rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-muted-foreground mb-8 text-sm">Join thousands of students and start mastering your exams.</p>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Sarah Ahmed"
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">University Email</label>
            <input
              type="email"
              placeholder="name@university.edu"
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </div>
          <Button className="w-full py-6 text-lg">Create Account</Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
