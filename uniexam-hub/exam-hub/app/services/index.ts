// Service Layer Exports
// Centralized export for all backend services

export { authService } from './auth.service';
export { userService } from './user.service';
export { sheetService } from './sheet.service';
export { questionService } from './question.service';
export { paymentService } from './payment.service';
export { settingsService } from './settings.service';
export { examService, ExamService } from './exam.service';

// Re-export types for convenience
export type {
  User,
  UserRole,
  Sheet,
  Question,
  QuestionOption,
  Purchase,
  PaymentStatus,
  Setting,
  UserProgress,
  Bookmark,
  CreateUserDTO,
  LoginDTO,
  CreateSheetDTO,
  CreateQuestionDTO,
  CreatePurchaseDTO,
  UpdatePurchaseStatusDTO,
  AuthResponse,
  SheetWithQuestions,
  SheetWithAccess,
  DashboardStats,
  LeaderboardEntry,
} from '../lib/types';
