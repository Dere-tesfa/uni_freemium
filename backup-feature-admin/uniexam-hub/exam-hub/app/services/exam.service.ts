// Exam Service
// Server-side only - handles exam-related operations and AI explanations

import { db } from '../lib/db';
import type { Question } from '../lib/types';

class ExamService {
  /**
   * Get all published exams/sheets
   */
  async getAllExams(filters?: {
    department?: string;
    university?: string;
  }) {
    const sheets = await db.getAllSheets({
      ...filters,
      is_published: true,
    });

    // Get purchase counts for each sheet
    const purchases = await db.getAllPurchases();
    const purchaseCounts = new Map<string, number>();
    
    purchases
      .filter(p => p.status === 'approved')
      .forEach(purchase => {
        const count = purchaseCounts.get(purchase.sheet_id) || 0;
        purchaseCounts.set(purchase.sheet_id, count + 1);
      });

    return sheets.map(sheet => ({
      id: sheet.id,
      title: sheet.title,
      dept: sheet.department,
      university: sheet.university,
      course_code: sheet.course_code,
      year: sheet.year,
      price: sheet.price,
      purchases: this.formatPurchaseCount(purchaseCounts.get(sheet.id) || 0),
      is_free: sheet.price === 0,
    }));
  }

  /**
   * Get exam by ID with access control
   */
  async getExamById(id: string, userId?: string) {
    const sheet = await db.findSheetById(id);
    if (!sheet) return null;

    const questions = await db.getQuestionsBySheetId(id);

    // Check access
    let hasAccess = false;
    let purchase = undefined;

    if (sheet.price === 0) {
      hasAccess = true;
    } else if (userId) {
      hasAccess = await db.checkUserAccess(userId, id);
      if (hasAccess) {
        const purchases = await db.getPurchasesByUserId(userId);
        purchase = purchases.find(
          p => p.sheet_id === id && p.status === 'approved'
        );
      } else {
        const purchases = await db.getPurchasesByUserId(userId);
        purchase = purchases.find(
          p => p.sheet_id === id && p.status === 'pending'
        );
      }
    }

    // If no access, return limited questions
    const availableQuestions = hasAccess ? questions : questions.slice(0, 2);

    return {
      id: sheet.id,
      title: sheet.title,
      dept: sheet.department,
      university: sheet.university,
      course_code: sheet.course_code,
      year: sheet.year,
      price: sheet.price,
      description: sheet.description,
      questions: availableQuestions,
      total_questions: questions.length,
      available_questions: availableQuestions.length,
      has_access: hasAccess,
      purchase,
    };
  }

  /**
   * Submit answer to a question
   */
  async submitAnswer(
    userId: string,
    questionId: string,
    userAnswer: string
  ): Promise<{
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
    lesson_content: string;
    ai_explanation?: string;
  }> {
    const question = await db.findQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Check if user has access to this sheet
    const sheet = await db.findSheetById(question.sheet_id);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    if (sheet.price > 0) {
      const hasAccess = await db.checkUserAccess(userId, question.sheet_id);
      if (!hasAccess) {
        throw new Error('You do not have access to this sheet');
      }
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

    const response = {
      is_correct: isCorrect,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      lesson_content: question.lesson_content,
    };

    // If answer is wrong, optionally generate AI explanation
    if (!isCorrect) {
      const aiExplanation = await this.generateAIExplanation(question, userAnswer);
      return {
        ...response,
        ai_explanation: aiExplanation,
      };
    }

    return response;
  }

  /**
   * Submit entire exam (all questions at once)
   */
  async submitExam(
    userId: string,
    sheetId: string,
    answers: Record<string, string>
  ): Promise<{
    score: number;
    total_questions: number;
    correct_answers: number;
    results: Array<{
      question_id: string;
      is_correct: boolean;
      user_answer: string;
      correct_answer: string;
      explanation: string;
      lesson_content: string;
    }>;
  }> {
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    // Check access
    if (sheet.price > 0) {
      const hasAccess = await db.checkUserAccess(userId, sheetId);
      if (!hasAccess) {
        throw new Error('You do not have access to this sheet');
      }
    }

    const questions = await db.getQuestionsBySheetId(sheetId);
    const results = [];
    let correctAnswers = 0;

    for (const question of questions) {
      const userAnswer = answers[question.id];
      if (!userAnswer) continue;

      const isCorrect = question.correct_answer === userAnswer;
      if (isCorrect) correctAnswers++;

      // Record progress
      await db.createUserProgress({
        id: this.generateId(),
        user_id: userId,
        question_id: question.id,
        sheet_id: sheetId,
        is_correct: isCorrect,
        user_answer: userAnswer,
        created_at: new Date(),
      });

      results.push({
        question_id: question.id,
        is_correct: isCorrect,
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        lesson_content: question.lesson_content,
      });
    }

    const totalQuestions = Object.keys(answers).length;
    const score = totalQuestions > 0 
      ? Math.round((correctAnswers / totalQuestions) * 100) 
      : 0;

    return {
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      results,
    };
  }

  /**
   * Get user's exam progress
   */
  async getUserExamProgress(userId: string, sheetId: string) {
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
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10) {
    return await db.getLeaderboard(limit);
  }

  /**
   * Get user's rank
   */
  async getUserRank(userId: string): Promise<{
    rank: number;
    score: number;
    total_users: number;
  }> {
    const leaderboard = await db.getLeaderboard(1000); // Get all users
    const userEntry = leaderboard.find(entry => entry.user_id === userId);

    if (!userEntry) {
      return {
        rank: 0,
        score: 0,
        total_users: leaderboard.length,
      };
    }

    return {
      rank: userEntry.rank,
      score: userEntry.score,
      total_users: leaderboard.length,
    };
  }

  /**
   * Generate AI explanation for wrong answer
   * This is a placeholder - integrate with OpenAI, Anthropic, or local LLM
   */
  private async generateAIExplanation(
    question: Question,
    userAnswer: string
  ): Promise<string> {
    // TODO: Integrate with AI service
    // Example with OpenAI:
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a helpful tutor explaining why an answer is incorrect."
    //     },
    //     {
    //       role: "user",
    //       content: `Question: ${question.question_text}\n\nCorrect Answer: ${question.correct_answer}\n\nStudent's Answer: ${userAnswer}\n\nExplain why the student's answer is incorrect and why the correct answer is right.`
    //     }
    //   ]
    // });
    // return response.choices[0].message.content;

    // Placeholder response
    const userOption = question.options.find(o => o.label === userAnswer);
    const correctOption = question.options.find(o => o.label === question.correct_answer);

    return `You selected "${userOption?.text || userAnswer}", but the correct answer is "${correctOption?.text || question.correct_answer}". ${question.explanation}`;
  }

  /**
   * Format purchase count for display
   */
  private formatPurchaseCount(count: number): string {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  /**
   * Get exam statistics (admin only)
   */
  async getExamStats(sheetId: string) {
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    const questions = await db.getQuestionsBySheetId(sheetId);
    const purchases = await db.getAllPurchases();
    const sheetPurchases = purchases.filter(p => p.sheet_id === sheetId);

    // Get all progress for this sheet
    const allProgress = await db.getUserProgress('', sheetId);
    const uniqueUsers = new Set(allProgress.map(p => p.user_id)).size;
    const totalAttempts = allProgress.length;
    const correctAttempts = allProgress.filter(p => p.is_correct).length;
    const averageAccuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    return {
      sheet_id: sheetId,
      title: sheet.title,
      question_count: questions.length,
      total_purchases: sheetPurchases.filter(p => p.status === 'approved').length,
      pending_purchases: sheetPurchases.filter(p => p.status === 'pending').length,
      unique_users: uniqueUsers,
      total_attempts: totalAttempts,
      average_accuracy: averageAccuracy,
    };
  }

  /**
   * Search exams
   */
  async searchExams(query: string, userId?: string) {
    const sheets = await db.getAllSheets({ is_published: true });
    const lowerQuery = query.toLowerCase();

    const filtered = sheets.filter(sheet =>
      sheet.title.toLowerCase().includes(lowerQuery) ||
      sheet.course_code.toLowerCase().includes(lowerQuery) ||
      sheet.department.toLowerCase().includes(lowerQuery) ||
      sheet.university.toLowerCase().includes(lowerQuery)
    );

    // Get purchase counts
    const purchases = await db.getAllPurchases();
    const purchaseCounts = new Map<string, number>();
    
    purchases
      .filter(p => p.status === 'approved')
      .forEach(purchase => {
        const count = purchaseCounts.get(purchase.sheet_id) || 0;
        purchaseCounts.set(purchase.sheet_id, count + 1);
      });

    return filtered.map(sheet => ({
      id: sheet.id,
      title: sheet.title,
      dept: sheet.department,
      university: sheet.university,
      course_code: sheet.course_code,
      year: sheet.year,
      price: sheet.price,
      purchases: this.formatPurchaseCount(purchaseCounts.get(sheet.id) || 0),
      is_free: sheet.price === 0,
    }));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const examService = new ExamService();

// Keep the old class for backward compatibility
export { ExamService };
