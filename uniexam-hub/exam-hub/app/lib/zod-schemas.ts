import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid university email").refine(
    (email) => email.endsWith(".edu") || email.includes("university"),
    "Please use a university email address"
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const examSubmissionSchema = z.object({
  examId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOption: z.number(),
  })),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ExamSubmissionInput = z.infer<typeof examSubmissionSchema>;
