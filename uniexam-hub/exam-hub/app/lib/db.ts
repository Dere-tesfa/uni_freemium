// Database Connection Utility
// This is a placeholder for database connection
// In production, you would use Prisma, Drizzle, or a PostgreSQL client

import type { 
  User, 
  Sheet, 
  Question, 
  Purchase, 
  Setting, 
  UserProgress, 
  Bookmark 
} from './types';

// Mock database - Replace with actual database connection
class Database {
  private users: User[] = [];
  private sheets: Sheet[] = [];
  private questions: Question[] = [];
  private purchases: Purchase[] = [];
  private settings: Setting[] = [];
  private userProgress: UserProgress[] = [];
  private bookmarks: Bookmark[] = [];

  // Initialize with default settings
  constructor() {
    this.initializeDefaultSettings();
  }

  private initializeDefaultSettings() {
    this.settings = [
      {
        key: 'bank_account_cbe',
        value: '1000123456789',
        description: 'Commercial Bank of Ethiopia Account',
        updated_at: new Date(),
      },
      {
        key: 'bank_account_awash',
        value: '01234567890123',
        description: 'Awash Bank Account',
        updated_at: new Date(),
      },
      {
        key: 'telebirr_number',
        value: '+251912345678',
        description: 'Telebirr Payment Number',
        updated_at: new Date(),
      },
    ];
  }

  // User operations
  async findUserByPhone(phone: string): Promise<User | undefined> {
    return this.users.find(u => u.phone === phone);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updates, updated_at: new Date() };
    return this.users[index];
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // Sheet operations
  async findSheetById(id: string): Promise<Sheet | undefined> {
    return this.sheets.find(s => s.id === id);
  }

  async getAllSheets(filters?: { 
    department?: string; 
    university?: string; 
    is_published?: boolean 
  }): Promise<Sheet[]> {
    let filtered = this.sheets;
    
    if (filters?.department) {
      filtered = filtered.filter(s => s.department === filters.department);
    }
    if (filters?.university) {
      filtered = filtered.filter(s => s.university === filters.university);
    }
    if (filters?.is_published !== undefined) {
      filtered = filtered.filter(s => s.is_published === filters.is_published);
    }
    
    return filtered;
  }

  async createSheet(sheet: Sheet): Promise<Sheet> {
    this.sheets.push(sheet);
    return sheet;
  }

  async updateSheet(id: string, updates: Partial<Sheet>): Promise<Sheet | undefined> {
    const index = this.sheets.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.sheets[index] = { ...this.sheets[index], ...updates, updated_at: new Date() };
    return this.sheets[index];
  }

  async deleteSheet(id: string): Promise<boolean> {
    const index = this.sheets.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.sheets.splice(index, 1);
    // Also delete associated questions
    this.questions = this.questions.filter(q => q.sheet_id !== id);
    return true;
  }

  // Question operations
  async findQuestionById(id: string): Promise<Question | undefined> {
    return this.questions.find(q => q.id === id);
  }

  async getQuestionsBySheetId(sheetId: string): Promise<Question[]> {
    return this.questions
      .filter(q => q.sheet_id === sheetId)
      .sort((a, b) => a.order - b.order);
  }

  async createQuestion(question: Question): Promise<Question> {
    this.questions.push(question);
    return question;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined> {
    const index = this.questions.findIndex(q => q.id === id);
    if (index === -1) return undefined;
    this.questions[index] = { ...this.questions[index], ...updates, updated_at: new Date() };
    return this.questions[index];
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const index = this.questions.findIndex(q => q.id === id);
    if (index === -1) return false;
    this.questions.splice(index, 1);
    return true;
  }

  async bulkCreateQuestions(questions: Question[]): Promise<Question[]> {
    this.questions.push(...questions);
    return questions;
  }

  // Purchase operations
  async findPurchaseById(id: string): Promise<Purchase | undefined> {
    return this.purchases.find(p => p.id === id);
  }

  async getPurchasesByUserId(userId: string): Promise<Purchase[]> {
    return this.purchases.filter(p => p.user_id === userId);
  }

  async getPurchasesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Purchase[]> {
    return this.purchases.filter(p => p.status === status);
  }

  async checkUserAccess(userId: string, sheetId: string): Promise<boolean> {
    const purchase = this.purchases.find(
      p => p.user_id === userId && p.sheet_id === sheetId && p.status === 'approved'
    );
    return !!purchase;
  }

  async createPurchase(purchase: Purchase): Promise<Purchase> {
    this.purchases.push(purchase);
    return purchase;
  }

  async updatePurchase(id: string, updates: Partial<Purchase>): Promise<Purchase | undefined> {
    const index = this.purchases.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.purchases[index] = { ...this.purchases[index], ...updates };
    return this.purchases[index];
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return this.purchases;
  }

  // Settings operations
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.find(s => s.key === key);
  }

  async getAllSettings(): Promise<Setting[]> {
    return this.settings;
  }

  async upsertSetting(setting: Setting): Promise<Setting> {
    const index = this.settings.findIndex(s => s.key === setting.key);
    if (index === -1) {
      this.settings.push(setting);
    } else {
      this.settings[index] = { ...setting, updated_at: new Date() };
    }
    return setting;
  }

  // User Progress operations
  async createUserProgress(progress: UserProgress): Promise<UserProgress> {
    this.userProgress.push(progress);
    return progress;
  }

  async getUserProgress(userId: string, sheetId: string): Promise<UserProgress[]> {
    return this.userProgress.filter(
      p => p.user_id === userId && p.sheet_id === sheetId
    );
  }

  async getUserStats(userId: string): Promise<{
    total_questions: number;
    correct_answers: number;
    score: number;
  }> {
    const progress = this.userProgress.filter(p => p.user_id === userId);
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
    this.bookmarks.push(bookmark);
    return bookmark;
  }

  async deleteBookmark(userId: string, questionId: string): Promise<boolean> {
    const index = this.bookmarks.findIndex(
      b => b.user_id === userId && b.question_id === questionId
    );
    if (index === -1) return false;
    this.bookmarks.splice(index, 1);
    return true;
  }

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return this.bookmarks.filter(b => b.user_id === userId);
  }

  async isBookmarked(userId: string, questionId: string): Promise<boolean> {
    return this.bookmarks.some(
      b => b.user_id === userId && b.question_id === questionId
    );
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    total_users: number;
    total_revenue: number;
    pending_payments: number;
    total_sheets: number;
    daily_revenue: number;
    monthly_revenue: number;
  }> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const approvedPurchases = this.purchases.filter(p => p.status === 'approved');
    const totalRevenue = approvedPurchases.reduce((sum, p) => sum + p.amount, 0);
    
    const dailyRevenue = approvedPurchases
      .filter(p => p.approved_at && p.approved_at >= today)
      .reduce((sum, p) => sum + p.amount, 0);
    
    const monthlyRevenue = approvedPurchases
      .filter(p => p.approved_at && p.approved_at >= monthStart)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      total_users: this.users.length,
      total_revenue: totalRevenue,
      pending_payments: this.purchases.filter(p => p.status === 'pending').length,
      total_sheets: this.sheets.length,
      daily_revenue: dailyRevenue,
      monthly_revenue: monthlyRevenue,
    };
  }

  // Leaderboard
  async getLeaderboard(limit: number = 10): Promise<Array<{
    user_id: string;
    phone: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    rank: number;
  }>> {
    const userStats = new Map<string, { correct: number; total: number }>();

    // Calculate stats for each user
    this.userProgress.forEach(progress => {
      const stats = userStats.get(progress.user_id) || { correct: 0, total: 0 };
      stats.total++;
      if (progress.is_correct) stats.correct++;
      userStats.set(progress.user_id, stats);
    });

    // Convert to array and calculate scores
    const leaderboard = Array.from(userStats.entries())
      .map(([userId, stats]) => {
        const user = this.users.find(u => u.id === userId);
        const score = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        return {
          user_id: userId,
          phone: user?.phone || 'Unknown',
          score,
          correct_answers: stats.correct,
          total_questions: stats.total,
          rank: 0, // Will be set after sorting
        };
      })
      .sort((a, b) => {
        // Sort by score, then by total questions answered
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

// Singleton instance
export const db = new Database();

// Export for testing or direct access
export { Database };
