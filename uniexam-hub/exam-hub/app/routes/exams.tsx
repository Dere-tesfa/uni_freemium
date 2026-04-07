import { useState } from "react";
import { Button } from "../components/ui/button";
import { useLoaderData, Link, useSearchParams } from "react-router";
import type { Route } from "./+types/exams";

import { sheetService } from "~/services";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const examType = url.searchParams.get("exam_type") || "";
  const filters: any = {};
  if (examType) filters.exam_type = examType;
  
  const exams = await sheetService.getPublishedSheets(filters);
  return { exams };
}

export default function Exams() {
  const { exams } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = searchParams.get("exam_type") || "";

  const examTypes = [
    { value: "", label: "All Exams" },
    { value: "mid", label: "Mid Exam" },
    { value: "final", label: "Final Exam" },
    { value: "quiz", label: "Quiz" },
    { value: "assignment", label: "Assignment" },
  ];

  const handleFilter = (type: string) => {
    if (type) {
      setSearchParams({ exam_type: type });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Available Exams</h1>
          <p className="text-muted-foreground mt-2">Premium resources for university excellence.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {examTypes.map((type) => (
            <Button
              key={type.value}
              variant={currentType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilter(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            to={`/exams/${exam.id}`}
            className="group flex flex-col p-6 rounded-2xl border bg-card shadow-sm hover:border-primary/40 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            {exam.image_url && (
              <img 
                src={exam.image_url} 
                alt={exam.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                {exam.department}
              </span>
              <span className="text-2xl font-black text-primary">${exam.price}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
              {exam.title}
            </h3>
            <div className="flex gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {exam.exam_type === "mid" ? "Mid Exam" : exam.exam_type === "final" ? "Final Exam" : exam.exam_type === "quiz" ? "Quiz" : "Assignment"}
              </span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                {exam.semester === "1" ? "1st Semester" : "2nd Semester"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
              {exam.description || "Comprehensive past exams including solutions, AI explanations, and performance tracking."}
            </p>
            <div className="mt-auto pt-6 border-t flex items-center justify-between text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-foreground font-bold">{exam.university}</span>
                <span className="ml-1">· {exam.year}</span>
              </div>
              <span className="text-primary font-semibold group-hover:underline">View Details →</span>
            </div>
          </Link>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exams found.</p>
        </div>
      )}
    </div>
  );
}
