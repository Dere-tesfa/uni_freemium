// Database Schema Types
// Based on the PRD requirements for UniExam Hub

export type UserRole = 'student' | 'admin';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  phone: string;
  email?: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Sheet {
  id: string;
  title: string;
  course_code: string;
  university: string;
  department: string;
  year: number;
  price: number; // 0 for free sheets
  is_published: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: string;
  sheet_id: string;
  question_text: string;
  image_url?: string;
  options: QuestionOption[];
  correct_answer: string; // A, B, C, or D
  explanation: string;
  lesson_content: string;
  order: number; // For ordering questions within a sheet
  created_at: Date;
  updated_at: Date;
}

export interface QuestionOption {
  label: string; // A, B, C, D
  text: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  sheet_id: string;
  status: PaymentStatus;
  screenshot_url?: string;
  amount: number;
  rejection_reason?: string;
  created_at: Date;
  approved_at?: Date;
  rejected_at?: Date;
}

export interface Setting {
  key: string;
  value: string;
  description?: string;
  updated_at: Date;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  sheet_id: string;
  is_correct: boolean;
  user_answer: string;
  created_at: Date;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  created_at: Date;
}

// DTOs (Data Transfer Objects)
export interface CreateUserDTO {
  phone: string;
  email?: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  phone: string;
  password: string;
}

export interface CreateSheetDTO {
  title: string;
  course_code: string;
  university: string;
  department: string;
  year: number;
  price: number;
  description?: string;
  is_published?: boolean;
}

export interface CreateQuestionDTO {
  sheet_id: string;
  question_text: string;
  image_url?: string;
  options: QuestionOption[];
  correct_answer: string;
  explanation: string;
  lesson_content: string;
  order: number;
}

export interface CreatePurchaseDTO {
  user_id: string;
  sheet_id: string;
  screenshot_url?: string;
  amount: number;
}

export interface UpdatePurchaseStatusDTO {
  status: PaymentStatus;
  rejection_reason?: string;
}

// Response Types
export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export interface SheetWithQuestions extends Sheet {
  questions: Question[];
  question_count: number;
}

export interface SheetWithAccess extends Sheet {
  has_access: boolean;
  purchase?: Purchase;
}

export interface DashboardStats {
  total_users: number;
  total_revenue: number;
  pending_payments: number;
  total_sheets: number;
  daily_revenue: number;
  monthly_revenue: number;
}

export interface LeaderboardEntry {
  user_id: string;
  phone: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  rank: number;
}
