import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/exams.$id.preview";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowLeft,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { useState } from "react";

const EXAMS: Record<
  string,
  {
    id: string;
    title: string;
    dept: string;
    price: number;
    questions: number;
    freeQuestions: {
      number: number;
      text: string;
      options: string[];
      answer: number;
      explanation: string;
    }[];
    lockedCount: number;
  }
> = {
  "1": {
    id: "1", title: "CS-101 Final Exam", dept: "Computer Science", price: 15, questions: 60, lockedCount: 57,
    freeQuestions: [
      {
        number: 1,
        text: "What is the time complexity of binary search on a sorted array of n elements?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        answer: 1,
        explanation: "Binary search repeatedly halves the search space. Each iteration eliminates half the remaining elements, leading to O(log n) time complexity.",
      },
      {
        number: 2,
        text: "Which data structure uses LIFO (Last In, First Out) ordering?",
        options: ["Queue", "Stack", "Linked List", "Heap"],
        answer: 1,
        explanation: "A Stack follows LIFO — the last element pushed is the first to be popped. Queues use FIFO instead.",
      },
      {
        number: 3,
        text: "In OOP, what is the term for a class inheriting properties from another class?",
        options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
        answer: 3,
        explanation: "Inheritance allows a child class to acquire attributes and methods of a parent class, promoting code reuse.",
      },
    ],
  },
  "2": {
    id: "2", title: "Bio-202 Midterm", dept: "Biology", price: 20, questions: 45, lockedCount: 42,
    freeQuestions: [
      {
        number: 1,
        text: "Which organelle is known as the 'powerhouse of the cell'?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
        answer: 2,
        explanation: "Mitochondria produce ATP through cellular respiration, supplying energy for all cellular activities — hence the nickname.",
      },
      {
        number: 2,
        text: "What is the complementary base pair to Adenine (A) in DNA?",
        options: ["Guanine (G)", "Cytosine (C)", "Thymine (T)", "Uracil (U)"],
        answer: 2,
        explanation: "In DNA, Adenine pairs with Thymine via two hydrogen bonds (A-T pairing), while Guanine pairs with Cytosine.",
      },
      {
        number: 3,
        text: "Which process converts glucose to pyruvate in the cytoplasm?",
        options: ["Krebs Cycle", "Oxidative Phosphorylation", "Glycolysis", "Calvin Cycle"],
        answer: 2,
        explanation: "Glycolysis is the first stage of cellular respiration, occurring in the cytoplasm and converting glucose into two pyruvate molecules with a net gain of 2 ATP.",
      },
    ],
  },
  "3": {
    id: "3", title: "Eng-305 Analysis", dept: "Engineering", price: 25, questions: 50, lockedCount: 47,
    freeQuestions: [
      {
        number: 1,
        text: "Which law states that the sum of currents entering a node equals the sum of currents leaving it?",
        options: ["Ohm's Law", "Kirchhoff's Voltage Law", "Kirchhoff's Current Law", "Faraday's Law"],
        answer: 2,
        explanation: "KCL (Kirchhoff's Current Law) is based on conservation of charge — all current into a node must also exit.",
      },
      {
        number: 2,
        text: "What is the unit of electrical resistance?",
        options: ["Volt", "Ampere", "Ohm (Ω)", "Watt"],
        answer: 2,
        explanation: "Resistance is measured in Ohms (Ω), named after Georg Simon Ohm who formulated the relationship V = IR.",
      },
      {
        number: 3,
        text: "Young's Modulus is a measure of a material's:",
        options: ["Density", "Stiffness / Elasticity", "Hardness", "Thermal conductivity"],
        answer: 1,
        explanation: "Young's Modulus (E) describes the ratio of stress to strain in the elastic deformation region, measuring stiffness.",
      },
    ],
  },
  "4": {
    id: "4", title: "Med-101 Anatomy", dept: "Medicine", price: 30, questions: 80, lockedCount: 77,
    freeQuestions: [
      {
        number: 1,
        text: "The femur is located in which part of the body?",
        options: ["Arm", "Chest", "Thigh", "Lower leg"],
        answer: 2,
        explanation: "The femur is the longest and strongest bone in the human body, located in the thigh between the hip and knee joints.",
      },
      {
        number: 2,
        text: "Which chamber of the heart pumps oxygenated blood to the body?",
        options: ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"],
        answer: 3,
        explanation: "The Left Ventricle has the thickest walls to generate sufficient pressure to pump oxygenated blood through the aorta to the entire body.",
      },
      {
        number: 3,
        text: "What is the largest organ of the human body?",
        options: ["Liver", "Skin", "Lung", "Brain"],
        answer: 1,
        explanation: "The skin (integumentary system) is the largest organ by surface area and weight, covering approximately 1.5–2 m² in an average adult.",
      },
    ],
  },
  "5": {
    id: "5", title: "Math-201 Calculus", dept: "Mathematics", price: 18, questions: 55, lockedCount: 52,
    freeQuestions: [
      {
        number: 1,
        text: "What is the derivative of sin(x)?",
        options: ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"],
        answer: 1,
        explanation: "d/dx[sin(x)] = cos(x). This is one of the fundamental differentiation rules derived from the limit definition.",
      },
      {
        number: 2,
        text: "The integral of 1/x dx is:",
        options: ["x²/2 + C", "ln|x| + C", "1/x² + C", "e^x + C"],
        answer: 1,
        explanation: "∫(1/x)dx = ln|x| + C. The natural logarithm is the antiderivative of the reciprocal function.",
      },
      {
        number: 3,
        text: "What does the second derivative test determine about a critical point?",
        options: ["The slope of the function", "Whether it is a local max, min, or inflection", "The area under the curve", "The limit of the function"],
        answer: 1,
        explanation: "If f''(c) > 0, the critical point is a local minimum. If f''(c) < 0, it's a local maximum. If f''(c) = 0, the test is inconclusive.",
      },
    ],
  },
  "6": {
    id: "6", title: "Arch-404 Design", dept: "Architecture", price: 40, questions: 30, lockedCount: 27,
    freeQuestions: [
      {
        number: 1,
        text: "Which architectural style is characterized by pointed arches, ribbed vaults, and flying buttresses?",
        options: ["Baroque", "Gothic", "Romanesque", "Modernist"],
        answer: 1,
        explanation: "Gothic architecture (12th–16th century) is distinguished by these structural innovations that allowed for taller, lighter structures with large stained-glass windows.",
      },
      {
        number: 2,
        text: "What does the term 'sustainable architecture' primarily emphasize?",
        options: ["Maximum floor area", "Reducing environmental impact & energy efficiency", "Traditional building styles", "Cost minimization only"],
        answer: 1,
        explanation: "Sustainable architecture focuses on minimizing environmental impact through energy efficiency, use of renewable materials, and designs that work with natural systems.",
      },
      {
        number: 3,
        text: "In the context of building design, what is 'fenestration'?",
        options: ["Foundation type", "Roof structure", "Arrangement of windows and doors", "Interior finishes"],
        answer: 2,
        explanation: "Fenestration refers to the design, proportion, and arrangement of window, door, and skylight openings in a building's facade.",
      },
    ],
  },
};

export async function loader({ params }: Route.LoaderArgs) {
  const exam = EXAMS[params.id];
  if (!exam) throw new Response("Not Found", { status: 404 });
  return { exam };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.exam) return [{ title: "Preview – UniExam Hub" }];
  return [{ title: `Free Preview: ${data.exam.title} – UniExam Hub` }];
}

function QuestionCard({
  q,
}: {
  q: (typeof EXAMS)["1"]["freeQuestions"][number];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setReveal] = useState(false);
  const submitted = selected !== null;
  const isCorrect = selected === q.answer;

  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="p-0">
        {/* Question header */}
        <div className="px-6 py-5 border-b border-border bg-card">
          <div className="flex items-start gap-3">
            <span className="size-7 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
              Q{q.number}
            </span>
            <p className="text-sm font-semibold leading-relaxed">{q.text}</p>
          </div>
        </div>

        {/* Options */}
        <div className="px-6 py-4 space-y-3 bg-background">
          {q.options.map((opt, i) => {
            let style =
              "border-border bg-card text-foreground hover:border-primary/50 cursor-pointer";
            if (submitted) {
              if (i === q.answer)
                style = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
              else if (i === selected && !isCorrect)
                style = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
              else style = "border-border bg-card text-muted-foreground cursor-default opacity-60";
            }

            return (
              <button
                key={i}
                id={`q${q.number}-option-${i}`}
                onClick={() => !submitted && setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${style}`}
              >
                <span className="size-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0 font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {submitted && i === q.answer && (
                  <CheckCircle className="size-4 ml-auto text-green-500 shrink-0" />
                )}
                {submitted && i === selected && !isCorrect && i !== q.answer && (
                  <XCircle className="size-4 ml-auto text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit / Explanation */}
        <div className="px-6 pb-5">
          {!submitted ? (
            <Button
              id={`q${q.number}-submit`}
              size="sm"
              className="mt-2"
              onClick={() => selected !== null && setReveal(true)}
              disabled={selected === null}
            >
              Check Answer
            </Button>
          ) : (
            <div className="mt-3">
              <div
                className={`flex items-center gap-2 mb-3 text-sm font-bold ${
                  isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {isCorrect ? (
                  <><CheckCircle className="size-4" /> Correct!</>
                ) : (
                  <><XCircle className="size-4" /> Incorrect — the correct answer is {String.fromCharCode(65 + q.answer)}</>
                )}
              </div>
              <div className="p-4 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 mb-1 font-semibold text-foreground text-xs uppercase tracking-wider">
                  <Sparkles className="size-3.5 text-primary" /> AI Explanation
                </div>
                {q.explanation}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PreviewPage() {
  const { exam } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to={`/exams/${exam.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Exam
          </Link>
          <Badge variant="secondary" className="text-xs font-bold px-3">
            <Eye className="size-3 mr-1.5" /> Free Preview
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            Free Sample Questions
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">{exam.title}</h1>
          <p className="text-muted-foreground text-sm">
            Try {exam.freeQuestions.length} free questions. Select an answer then click{" "}
            <strong>Check Answer</strong> for instant AI feedback.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6 text-xs font-semibold text-muted-foreground">
          <span>{exam.freeQuestions.length} free questions unlocked</span>
          <span>{exam.lockedCount} more with full access</span>
        </div>
        <div className="h-2 bg-muted rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(exam.freeQuestions.length / exam.questions) * 100}%` }}
          />
        </div>

        {/* Free Questions */}
        <div className="space-y-6">
          {exam.freeQuestions.map((q) => (
            <QuestionCard key={q.number} q={q} />
          ))}
        </div>

        {/* Locked section CTA */}
        <div className="mt-8 relative overflow-hidden rounded-2xl border-2 border-dashed border-border">
          {/* Blurred ghost questions */}
          <div className="px-6 py-5 space-y-4 opacity-30 blur-sm pointer-events-none select-none">
            {[4, 5, 6].map((n) => (
              <div key={n} className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm text-center p-8">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="size-7 text-primary" />
            </div>
            <h2 className="text-xl font-black mb-2">
              {exam.lockedCount} More Questions Locked
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Purchase full access to unlock all {exam.questions} questions with model answers and AI explanations.
            </p>
            <Link to={`/exams/${exam.id}/checkout`}>
              <Button id="preview-unlock-btn" size="lg" className="font-bold px-8 gap-2">
                <Sparkles className="size-4" />
                Unlock Full Exam — ${exam.price}
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
