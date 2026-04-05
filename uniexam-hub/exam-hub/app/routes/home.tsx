import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Link } from "react-router"
import { 
  BookOpen, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap 
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto text-center relative z-10">
          {Badge && (
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 rounded-full text-sm font-semibold animate-in fade-in slide-in-from-bottom-3">
              ✨ Revolutionizing Exam Prep
            </Badge>
          )}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-primary mb-6 text-balance">
            Master University Exams <br />
            <span className="text-foreground">with AI-Powered Insights</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground mb-10 text-balance">
            Join thousands of students across top departments. Access premium past papers, expert-verified solutions, and instant AI tutoring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/exams" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-10 text-lg font-bold gap-2">
                Browse Exams {ArrowRight && <ArrowRight className="size-5" />}
              </Button>
            </Link>
            <Link to="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-10 text-lg font-bold">
                Join Now
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12 opacity-70">
            <div className="flex items-center gap-2 font-semibold">
              {ShieldCheck && <ShieldCheck className="size-5 text-primary" />} Verified Resources
            </div>
            <div className="flex items-center gap-2 font-semibold">
              {GraduationCap && <GraduationCap className="size-5 text-primary" />} Top Universities
            </div>
            <div className="flex items-center gap-2 font-semibold">
              {Sparkles && <Sparkles className="size-5 text-primary" />} AI Explanations
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why UniExam Hub?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to boost your GPA and understanding in one unified platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {BookOpen && <BookOpen className="size-6 text-primary" />}
                </div>
                <CardTitle>Premium Exam Sheets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">High-quality, curated past papers from elite students and faculty across all major departments.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {Sparkles && <Sparkles className="size-6 text-primary" />}
                </div>
                <CardTitle>AI-Powered Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Stuck on a question? Our AI provides instant, detailed explanations tailored to your specific curriculum.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {Trophy && <Trophy className="size-6 text-primary" />}
                </div>
                <CardTitle>Gamified Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Track your progress, climb the global leaderboard, and earn rewards while mastering your courses.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-primary-foreground relative overflow-hidden shadow-2xl">
            {/* Abstract Background Circle */}
            <div className="absolute -top-24 -right-24 size-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 size-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Ready to Ace Your <br className="hidden md:block" /> Next Exam?
              </h2>
              <p className="text-primary-foreground/80 mb-10 max-w-2xl text-lg">
                Join the thousands of students who have already improved their scores with UniExam Hub. Get started today and get your first practice test for free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link to="/auth/signup" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full h-14 px-12 text-lg font-bold">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/exams" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 px-12 text-lg font-bold bg-transparent border-white/30 hover:bg-white/10 text-white">
                    Browse All Exams
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
