import { Button } from "../components/ui/button";
import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/exams";

// Mock Service call
async function getExams() {
  return [
    { id: "1", title: "CS-101 Final Exam", dept: "Computer Science", price: 15, rating: 4.8, purchases: "1.2k" },
    { id: "2", title: "Bio-202 Midterm", dept: "Biology", price: 20, rating: 4.9, purchases: "800" },
    { id: "3", title: "Eng-305 Analysis", dept: "Engineering", price: 25, rating: 4.7, purchases: "2.1k" },
    { id: "4", title: "Med-101 Anatomy", dept: "Medicine", price: 30, rating: 5.0, purchases: "3.5k" },
    { id: "5", title: "Math-201 Calculus", dept: "Mathematics", price: 18, rating: 4.6, purchases: "4.2k" },
    { id: "6", title: "Arch-404 Design", dept: "Architecture", price: 40, rating: 4.9, purchases: "600" },
  ];
}

export async function loader() {
  const exams = await getExams();
  return { exams };
}

export default function Exams() {
  const { exams } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Available Exams</h1>
          <p className="text-muted-foreground mt-2">Premium resources for university excellence.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">All Departments</Button>
          <Button variant="outline" size="sm">Sort by Popularity</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            to={`/exams/${exam.id}`}
            className="group flex flex-col p-6 rounded-2xl border bg-card shadow-sm hover:border-primary/40 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                {exam.dept}
              </span>
              <span className="text-2xl font-black text-primary">${exam.price}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
              {exam.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
              Comprehensive past exams including solutions, AI explanations, and performance tracking.
            </p>
            <div className="mt-auto pt-6 border-t flex items-center justify-between text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-foreground font-bold">{exam.rating}</span>
                <span className="ml-1">· {exam.purchases} Purchases</span>
              </div>
              <span className="text-primary font-semibold group-hover:underline">View Details →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
