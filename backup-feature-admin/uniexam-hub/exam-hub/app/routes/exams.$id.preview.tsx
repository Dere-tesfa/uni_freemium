import { Link, useLoaderData, redirect } from "react-router";
import type { Route } from "./+types/exams.$id.preview";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowLeft,
  Lock,
  Sparkles,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { sheetService } from "~/services";
import { getAuthUser } from "~/lib/middleware.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await getAuthUser(request);
  const exam = await sheetService.getSheetWithAccess(params.id, user?.id);
  
  if (!exam) throw new Response("Not Found", { status: 404 });

  if (!exam.has_access) {
    if (user) {
      return redirect(`/exams/${params.id}`);
    }
    return redirect(`/auth/login?redirect=/exams/${params.id}/preview`);
  }

  const questions = await sheetService.getSheetWithQuestions(params.id!);
  
  const previewQuestions = questions?.questions?.slice(0, 3) || [];
  
  return { 
    exam: {
      id: exam.id,
      title: exam.title,
      department: exam.department,
      price: exam.price,
      question_count: questions?.questions?.length || 0,
    },
    questions: previewQuestions,
    locked_count: (questions?.questions?.length || 0) - previewQuestions.length
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Preview – UniExam Hub" }];
  return [{ title: `Free Preview: ${data.exam.title} – UniExam Hub` }];
}

interface Question {
  id: string;
  question_text: string;
  options: { label: string; text: string }[];
  correct_answer: string;
  explanation: string;
}

function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setReveal] = useState(false);
  const submitted = selected !== null;
  const isCorrect = selected === q.correct_answer;

  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="px-6 py-5 border-b border-border bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {index + 1}
              </span>
              <p className="font-semibold text-lg leading-relaxed">{q.question_text}</p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">Free Preview</Badge>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {q.options.map((opt, i) => {
            const label = String.fromCharCode(65 + i);
            const isSelected = selected === label;
            const isCorrectOption = label === q.correct_answer;
            
            let optionClass = "p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-all";
            if (submitted) {
              if (isCorrectOption) {
                optionClass = "p-4 rounded-xl border-green-500 bg-green-500/10";
              } else if (isSelected && !isCorrect) {
                optionClass = "p-4 rounded-xl border-red-500 bg-red-500/10";
              }
            } else if (isSelected) {
              optionClass = "p-4 rounded-xl border-primary bg-primary/10";
            }

            return (
              <div
                key={label}
                className={optionClass}
                onClick={() => !submitted && setSelected(label)}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {label}
                  </span>
                  <span className="text-sm font-medium">{opt.text}</span>
                  {submitted && isCorrectOption && (
                    <CheckCircle className="size-5 text-green-500 ml-auto" />
                  )}
                  {submitted && isSelected && !isCorrect && (
                    <XCircle className="size-5 text-red-500 ml-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-6">
          {submitted ? (
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="size-5 text-green-500" />
                ) : (
                  <XCircle className="size-5 text-red-500" />
                )}
                <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="size-4 text-primary mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground">{q.explanation}</p>
              </div>
            </div>
          ) : (
            <Button onClick={() => setReveal(true)} variant="outline" className="w-full">
              <Eye className="size-4 mr-2" />
              Reveal Answer
            </Button>
          )}
          
          {revealed && !submitted && (
            <div className="mt-4 rounded-xl bg-primary/5 p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-5 text-primary" />
                <span className="font-bold text-primary">Correct Answer: {q.correct_answer}</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="size-4 text-primary mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground">{q.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamPreview() {
  const { exam, questions, locked_count } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/exams/${exam.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Exam
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">Preview Mode</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">{exam.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{exam.department}</span>
            <span>•</span>
            <span>{exam.question_count} Questions</span>
          </div>
        </div>

        <div className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Free Preview:</strong> Showing 3 of {exam.question_count} questions. 
            Purchase to access all questions and get lifetime access.
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q: Question, i: number) => (
            <QuestionCard key={q.id} q={q} index={i} />
          ))}
        </div>

        {locked_count > 0 && (
          <div className="mt-8 p-6 rounded-xl border border-dashed border-border text-center">
            <Lock className="size-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-bold mb-2">{locked_count} more questions locked</p>
            <p className="text-sm text-muted-foreground mb-4">
              Purchase this exam to unlock all questions and get detailed explanations.
            </p>
            <Link to={`/exams/${exam.id}`}>
              <Button>Purchase Access - {exam.price} ETB</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}