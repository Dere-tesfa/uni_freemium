// Database Connection Utility using Prisma
import { PrismaClient } from '@prisma/client';
import type { 
  User, 
  Sheet, 
  Question, 
  Purchase, 
  Setting, 
  UserProgress, 
  Bookmark,
  QuestionOption
} from './types';

// Singleton Prisma Client
const prisma = new PrismaClient();

class Database {
  // User operations
  async findUserByPhone(phone: string): Promise<User | undefined> {
    try {
      const user = await prisma.user.findUnique({ where: { phone } });
      return user ? { ...user, role: user.role as 'student' | 'admin' } : undefined;
    } catch (error) {
      console.error('Database error in findUserByPhone:', error);
      return undefined;
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? { ...user, role: user.role as 'student' | 'admin' } : undefined;
    } catch (error) {
      console.error('Database error in findUserByEmail:', error);
      return undefined;
    }
  }

  async findUserById(id: string): Promise<User | undefined> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? { ...user, role: user.role as 'student' | 'admin' } : undefined;
    } catch (error) {
      console.error('Database error in findUserById:', error);
      return undefined;
    }
  }

  async createUser(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: user.id || undefined,
        phone: user.phone,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
      }
    });
    return { ...created, role: created.role as 'student' | 'admin' };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(u => ({ ...u, role: u.role as 'student' | 'admin' }));
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: updates
      });
      return { ...updated, role: updated.role as 'student' | 'admin' };
    } catch {
      return undefined;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // Sheet operations
  async findSheetById(id: string): Promise<Sheet | undefined> {
    const sheet = await prisma.sheet.findUnique({ where: { id } });
    return sheet || undefined;
  }

  async getAllSheets(filters?: { 
    department?: string; 
    university?: string; 
    is_published?: boolean;
    exam_type?: string;
  }): Promise<Sheet[]> {
    const where: any = {};
    if (filters?.department) where.department = filters.department;
    if (filters?.university) where.university = filters.university;
    if (filters?.is_published !== undefined) where.is_published = filters.is_published;
    if (filters?.exam_type) where.exam_type = filters.exam_type;
    
    return await prisma.sheet.findMany({ where });
  }

  async createSheet(sheet: Sheet): Promise<Sheet> {
    return await prisma.sheet.create({
      data: {
        id: sheet.id || undefined,
        title: sheet.title,
        course_code: sheet.course_code,
        university: sheet.university,
        department: sheet.department,
        year: sheet.year,
        exam_type: sheet.exam_type,
        semester: sheet.semester,
        price: sheet.price,
        is_published: sheet.is_published,
        description: sheet.description,
        image_url: sheet.image_url,
      }
    });
  }

  async updateSheet(id: string, updates: Partial<Sheet>): Promise<Sheet | undefined> {
    try {
      return await prisma.sheet.update({
        where: { id },
        data: updates
      });
    } catch {
      return undefined;
    }
  }

  async deleteSheet(id: string): Promise<boolean> {
    try {
      await prisma.sheet.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // Question operations
  async findQuestionById(id: string): Promise<Question | undefined> {
    const q = await prisma.question.findUnique({ where: { id } });
    return q ? { ...q, options: q.options as any as QuestionOption[] } : undefined;
  }

  async getQuestionsBySheetId(sheetId: string): Promise<Question[]> {
    const questions = await prisma.question.findMany({
      where: { sheet_id: sheetId },
      orderBy: { order: 'asc' }
    });
    return questions.map(q => ({ ...q, options: q.options as any as QuestionOption[] }));
  }

  async createQuestion(question: Question): Promise<Question> {
    const q = await prisma.question.create({
      data: {
        id: question.id || undefined,
        sheet_id: question.sheet_id,
        question_text: question.question_text,
        image_url: question.image_url,
        options: question.options as any,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        lesson_content: question.lesson_content,
        order: question.order
      }
    });
    return { ...q, options: q.options as any as QuestionOption[] };
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined> {
    try {
      const data: any = { ...updates };
      if (updates.options) data.options = updates.options as any;
      const q = await prisma.question.update({
        where: { id },
        data
      });
      return { ...q, options: q.options as any as QuestionOption[] };
    } catch {
      return undefined;
    }
  }

  async deleteQuestion(id: string): Promise<boolean> {
    try {
      await prisma.question.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async bulkCreateQuestions(questions: Question[]): Promise<Question[]> {
    const created: Question[] = [];
    for (const q of questions) {
      created.push(await this.createQuestion(q));
    }
    return created;
  }

  // Purchase operations
  async findPurchaseById(id: string): Promise<Purchase | undefined> {
    const p = await prisma.purchase.findUnique({ where: { id } });
    return p ? { ...p, status: p.status as 'pending'|'approved'|'rejected' } : undefined;
  }

  async getPurchasesByUserId(userId: string): Promise<Purchase[]> {
    const p = await prisma.purchase.findMany({ where: { user_id: userId } });
    return p.map(x => ({ ...x, status: x.status as 'pending'|'approved'|'rejected' }));
  }

  async getPurchasesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Purchase[]> {
    const p = await prisma.purchase.findMany({ where: { status } });
    return p.map(x => ({ ...x, status: x.status as 'pending'|'approved'|'rejected' }));
  }

  async checkUserAccess(userId: string, sheetId: string): Promise<boolean> {
    const count = await prisma.purchase.count({
      where: { user_id: userId, sheet_id: sheetId, status: 'approved' }
    });
    return count > 0;
  }

  async createPurchase(purchase: Purchase): Promise<Purchase> {
    const p = await prisma.purchase.create({
      data: {
        id: purchase.id || undefined,
        user_id: purchase.user_id,
        sheet_id: purchase.sheet_id,
        status: purchase.status,
        screenshot_url: purchase.screenshot_url,
        amount: purchase.amount,
        transaction_id: purchase.transaction_id,
        payer_phone: purchase.payer_phone,
      }
    });
    return { ...p, status: p.status as 'pending'|'approved'|'rejected' };
  }

  async updatePurchase(id: string, updates: Partial<Purchase>): Promise<Purchase | undefined> {
    try {
      const p = await prisma.purchase.update({
        where: { id },
        data: updates
      });
      return { ...p, status: p.status as 'pending'|'approved'|'rejected' };
    } catch {
      return undefined;
    }
  }

  async getAllPurchases(): Promise<Purchase[]> {
    const p = await prisma.purchase.findMany();
    return p.map(x => ({ ...x, status: x.status as 'pending'|'approved'|'rejected' }));
  }

  // Settings operations
  async getSetting(key: string): Promise<Setting | undefined> {
    const s = await prisma.setting.findUnique({ where: { key } });
    return s || undefined;
  }

  async getAllSettings(): Promise<Setting[]> {
    return await prisma.setting.findMany();
  }

  async upsertSetting(setting: Setting): Promise<Setting> {
    return await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: { key: setting.key, value: setting.value, description: setting.description }
    });
  }

  // User Progress operations
  async createUserProgress(progress: UserProgress): Promise<UserProgress> {
    return await prisma.userProgress.create({
      data: {
        id: progress.id || undefined,
        user_id: progress.user_id,
        question_id: progress.question_id,
        sheet_id: progress.sheet_id,
        is_correct: progress.is_correct,
        user_answer: progress.user_answer,
      }
    });
  }

  async getUserProgress(userId: string, sheetId: string): Promise<UserProgress[]> {
    return await prisma.userProgress.findMany({
      where: { user_id: userId, sheet_id: sheetId }
    });
  }

  async getUserStats(userId: string): Promise<{
    total_questions: number;
    correct_answers: number;
    score: number;
  }> {
    const progress = await prisma.userProgress.findMany({ where: { user_id: userId } });
    const total = progress.length;
    const correct = progress.filter(p => p.is_correct).length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return {
      total_questions: total,
      correct_answers: correct,
      score,
    };
  }

  // Bookmark operations
  async createBookmark(bookmark: Bookmark): Promise<Bookmark> {
    return await prisma.bookmark.create({
      data: {
        id: bookmark.id || undefined,
        user_id: bookmark.user_id,
        question_id: bookmark.question_id,
      }
    });
  }

  async deleteBookmark(userId: string, questionId: string): Promise<boolean> {
    try {
      await prisma.bookmark.delete({
        where: { user_id_question_id: { user_id: userId, question_id: questionId } }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return await prisma.bookmark.findMany({ where: { user_id: userId } });
  }

  async isBookmarked(userId: string, questionId: string): Promise<boolean> {
    const count = await prisma.bookmark.count({
      where: { user_id: userId, question_id: questionId }
    });
    return count > 0;
  }

  // Dashboard stats
  async getDashboardStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const approvedPurchases = await prisma.purchase.findMany({ where: { status: 'approved' } });
    const totalRevenue = approvedPurchases.reduce((sum, p) => sum + p.amount, 0);
    
    const dailyRevenue = approvedPurchases
      .filter(p => p.approved_at && p.approved_at >= today)
      .reduce((sum, p) => sum + p.amount, 0);
    
    const monthlyRevenue = approvedPurchases
      .filter(p => p.approved_at && p.approved_at >= monthStart)
      .reduce((sum, p) => sum + p.amount, 0);

    const totalUsers = await prisma.user.count();
    const totalSheets = await prisma.sheet.count();
    const pendingPayments = await prisma.purchase.count({ where: { status: 'pending' } });

    return {
      total_users: totalUsers,
      total_revenue: totalRevenue,
      pending_payments: pendingPayments,
      total_sheets: totalSheets,
      daily_revenue: dailyRevenue,
      monthly_revenue: monthlyRevenue,
    };
  }

  // Leaderboard
  async getLeaderboard(limit: number = 10) {
    const users = await prisma.user.findMany({
      include: { progress: true }
    });

    const leaderboard = users.map(user => {
      const total = user.progress.length;
      const correct = user.progress.filter(p => p.is_correct).length;
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;
      return {
        user_id: user.id,
        phone: user.phone,
        score,
        correct_answers: correct,
        total_questions: total,
        rank: 0,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.total_questions - a.total_questions;
    })
    .slice(0, limit)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return leaderboard;
  }
}

export const db = new Database();
export { Database };
