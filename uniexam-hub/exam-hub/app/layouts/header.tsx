import { Link } from "react-router"
import { Button } from "../components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useUIStore } from "../store/use-ui-store"

export function Header() {
  const { theme, toggleTheme } = useUIStore()

  return (
    <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">UniExam Hub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/exams" className="text-sm font-medium hover:text-primary transition-colors">
              Exams
            </Link>
            <Link to="/departments" className="text-sm font-medium hover:text-primary transition-colors">
              Departments
            </Link>
            <Link to="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
              Leaderboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </Button>
          <Link to="/auth/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/auth/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
