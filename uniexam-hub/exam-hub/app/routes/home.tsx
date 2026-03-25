import { Button } from "../components/ui/button"
import { Link } from "react-router"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-primary mb-6">
        Master Your University Exams
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground mb-10">
        UniExam Hub is your one-stop platform for premium exam resources, AI-powered explanations, and practice tests tailored to your curriculum.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/exams">
          <Button size="lg" className="h-12 px-8">Browse Exams</Button>
        </Link>
        <Link to="/departments">
          <Button size="lg" variant="outline" className="h-12 px-8">Explore Departments</Button>
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h3 className="text-xl font-bold mb-2">Premium Sheets</h3>
          <p className="text-muted-foreground">High-quality exam sheets from top departments and students.</p>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h3 className="text-xl font-bold mb-2">AI Explanations</h3>
          <p className="text-muted-foreground">Get instant, detailed AI feedback on every practice question.</p>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
          <p className="text-muted-foreground">Track your progress and identify your weak spots over time.</p>
        </div>
      </div>
    </div>
  )
}
