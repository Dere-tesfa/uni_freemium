import { Link } from "react-router"

export function Footer() {
  return (
    <footer className="border-t py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-lg">UniExam Hub</span>
            <p className="text-sm text-muted-foreground">
              Your ultimate platform for university exam prep and excellence.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Platform</h4>
            <Link to="/exams" className="text-sm text-muted-foreground hover:text-primary transition-colors">Exams</Link>
            <Link to="/departments" className="text-sm text-muted-foreground hover:text-primary transition-colors">Departments</Link>
            <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Leaderboard</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Support</h4>
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Social</h4>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UniExam Hub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
