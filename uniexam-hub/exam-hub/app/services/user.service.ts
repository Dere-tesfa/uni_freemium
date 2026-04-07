import bcrypt from 'bcrypt';
import { db } from '../lib/db';
import type { User } from '../lib/types';

class UserService {
  /**
   * Reset user password (admin only)
   */
  async resetPassword(userId: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await db.updateUser(userId, { password_hash: hashedPassword });
    return !!updated;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await db.getAllUsers();
    return users.map(({ password_hash, ...user }) => user);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await db.findUserById(userId);
    if (!user) return null;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user profile with statistics
   */
  async getUserProfile(userId: string): Promise<{
    user: Omit<User, 'password_hash'>;
    stats: {
      total_questions: number;
      correct_answers: number;
      score: number;
    };
    purchased_sheets: number;
    bookmarks: number;
  } | null> {
    const user = await db.findUserById(userId);
    if (!user) return null;

    const { password_hash, ...userWithoutPassword } = user;
    const stats = await db.getUserStats(userId);
    const purchases = await db.getPurchasesByUserId(userId);
    const approvedPurchases = purchases.filter(p => p.status === 'approved');
    const bookmarks = await db.getUserBookmarks(userId);

    return {
      user: userWithoutPassword,
      stats,
      purchased_sheets: approvedPurchases.length,
      bookmarks: bookmarks.length,
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: { email?: string; phone?: string }
  ): Promise<Omit<User, 'password_hash'> | null> {
    // If phone is being updated, check if it's already taken
    if (updates.phone) {
      const existingUser = await db.findUserByPhone(updates.phone);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Phone number already in use');
      }
    }

    const updatedUser = await db.updateUser(userId, updates);
    if (!updatedUser) return null;

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<boolean> {
    return await db.deleteUser(userId);
  }

  /**
   * Get user's purchased sheets
   */
  async getUserPurchases(userId: string) {
    const purchases = await db.getPurchasesByUserId(userId);
    
    // Get sheet details for each purchase
    const purchasesWithSheets = await Promise.all(
      purchases.map(async (purchase) => {
        const sheet = await db.findSheetById(purchase.sheet_id);
        return {
          ...purchase,
          sheet,
        };
      })
    );

    return purchasesWithSheets;
  }

  /**
   * Get user's bookmarked questions
   */
  async getUserBookmarks(userId: string) {
    const bookmarks = await db.getUserBookmarks(userId);
    
    // Get question details for each bookmark
    const bookmarksWithQuestions = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const question = await db.findQuestionById(bookmark.question_id);
        const sheet = question ? await db.findSheetById(question.sheet_id) : null;
        return {
          ...bookmark,
          question,
          sheet,
        };
      })
    );

    return bookmarksWithQuestions;
  }

  /**
   * Toggle bookmark for a question
   */
  async toggleBookmark(userId: string, questionId: string): Promise<{
    bookmarked: boolean;
  }> {
    const isBookmarked = await db.isBookmarked(userId, questionId);

    if (isBookmarked) {
      await db.deleteBookmark(userId, questionId);
      return { bookmarked: false };
    } else {
      await db.createBookmark({
        id: this.generateId(),
        user_id: userId,
        question_id: questionId,
        created_at: new Date(),
      });
      return { bookmarked: true };
    }
  }

  /**
   * Get user's progress for a specific sheet
   */
  async getUserSheetProgress(userId: string, sheetId: string) {
    const progress = await db.getUserProgress(userId, sheetId);
    const questions = await db.getQuestionsBySheetId(sheetId);

    const answeredQuestions = progress.length;
    const correctAnswers = progress.filter(p => p.is_correct).length;
    const totalQuestions = questions.length;
    const completionPercentage = totalQuestions > 0 
      ? Math.round((answeredQuestions / totalQuestions) * 100) 
      : 0;
    const accuracy = answeredQuestions > 0 
      ? Math.round((correctAnswers / answeredQuestions) * 100) 
      : 0;

    return {
      sheet_id: sheetId,
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
      correct_answers: correctAnswers,
      completion_percentage: completionPercentage,
      accuracy,
      progress: progress.map(p => ({
        question_id: p.question_id,
        is_correct: p.is_correct,
        user_answer: p.user_answer,
        created_at: p.created_at,
      })),
    };
  }

  /**
   * Record user's answer to a question
   */
  async recordAnswer(
    userId: string,
    questionId: string,
    userAnswer: string
  ): Promise<{
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
    lesson_content: string;
  }> {
    const question = await db.findQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const isCorrect = question.correct_answer === userAnswer;

    // Record progress
    await db.createUserProgress({
      id: this.generateId(),
      user_id: userId,
      question_id: questionId,
      sheet_id: question.sheet_id,
      is_correct: isCorrect,
      user_answer: userAnswer,
      created_at: new Date(),
    });

    return {
      is_correct: isCorrect,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      lesson_content: question.lesson_content,
    };
  }

  /**
   * Search users (admin only)
   */
  async searchUsers(query: string): Promise<Omit<User, 'password_hash'>[]> {
    const allUsers = await db.getAllUsers();
    const lowerQuery = query.toLowerCase();

    const filtered = allUsers.filter(user => 
      user.phone.toLowerCase().includes(lowerQuery) ||
      user.email?.toLowerCase().includes(lowerQuery)
    );

    return filtered.map(({ password_hash, ...user }) => user);
  }

  /**
   * Get user statistics summary
   */
  async getUserStats(userId: string) {
    return await db.getUserStats(userId);
  }

  /**
   * Grant manual access to a sheet (admin only)
   */
  async grantSheetAccess(userId: string, sheetId: string): Promise<void> {
    // Check if user already has access
    const hasAccess = await db.checkUserAccess(userId, sheetId);
    if (hasAccess) {
      throw new Error('User already has access to this sheet');
    }

    // Get sheet to get the price
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    // Create an approved purchase record
    await db.createPurchase({
      id: this.generateId(),
      user_id: userId,
      sheet_id: sheetId,
      status: 'approved',
      amount: sheet.price,
      created_at: new Date(),
      approved_at: new Date(),
    });
  }

  /**
   * Revoke access to a sheet (admin only)
   */
  async revokeSheetAccess(userId: string, sheetId: string): Promise<void> {
    const purchases = await db.getPurchasesByUserId(userId);
    const purchase = purchases.find(
      p => p.sheet_id === sheetId && p.status === 'approved'
    );

    if (!purchase) {
      throw new Error('User does not have access to this sheet');
    }

    // Update purchase status to rejected
    await db.updatePurchase(purchase.id, {
      status: 'rejected',
      rejection_reason: 'Access revoked by admin',
      rejected_at: new Date(),
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const userService = new UserService();
