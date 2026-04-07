import { Link } from "react-router"
import { Button } from "../ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useUIStore } from "../../stores/use-ui-store"
import { useState } from "react"
import { cn } from "../../lib/utils"
import type { User } from "../../lib/types"

interface HeaderProps {
  user?: Omit<User, 'password_hash'> | null
}

export function Header({ user }: HeaderProps) {
  const { theme, toggleTheme } = useUIStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { to: "/exams", label: "Exams" },
    { to: "/departments", label: "Departments" },
    { to: "/leaderboard", label: "Leaderboard" },
  ]

  return (
    <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xl">U</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">UniExam</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full size-9"
          >
            {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </Button>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-foreground">{user.email || user.phone}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black">{user.role}</span>
                </div>
                <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                  {(user.email || user.phone).charAt(0).toUpperCase()}
                </div>
                <form action="/auth/logout" method="post">
                  <Button variant="ghost" size="sm">Log out</Button>
                </form>
              </div>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed inset-x-0 top-16 bg-background border-b transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="text-lg font-medium p-2 hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          <div className="flex flex-col gap-2 p-2">
            {user ? (
              <div className="flex flex-col gap-3 p-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {(user.email || user.phone).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{user.email || user.phone}</span>
                    <span className="text-xs text-muted-foreground uppercase">{user.role}</span>
                  </div>
                </div>
                <form action="/auth/logout" method="post">
                  <Button variant="outline" className="w-full">Log out</Button>
                </form>
              </div>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
