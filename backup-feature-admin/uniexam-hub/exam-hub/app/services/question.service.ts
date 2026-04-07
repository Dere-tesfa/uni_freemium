// Question Service
// Server-side only - handles question CRUD operations

import { db } from '../lib/db';
import type { Question, CreateQuestionDTO } from '../lib/types';

class QuestionService {
  /**
   * Get question by ID
   */
  async getQuestionById(questionId: string): Promise<Question | null> {
    const question = await db.findQuestionById(questionId);
    return question || null;
  }

  /**
   * Get all questions for a sheet
   */
  async getQuestionsBySheetId(sheetId: string): Promise<Question[]> {
    return await db.getQuestionsBySheetId(sheetId);
  }

  /**
   * Create new question (admin only)
   */
  async createQuestion(data: CreateQuestionDTO): Promise<Question> {
    // Validate options
    if (data.options.length < 2) {
      throw new Error('Question must have at least 2 options');
    }

    // Validate correct answer
    const validAnswers = data.options.map(o => o.label);
    if (!validAnswers.includes(data.correct_answer)) {
      throw new Error('Correct answer must match one of the option labels');
    }

    const question: Question = {
      id: this.generateId(),
      sheet_id: data.sheet_id,
      question_text: data.question_text,
      image_url: data.image_url,
      options: data.options,
      correct_answer: data.correct_answer,
      explanation: data.explanation,
      lesson_content: data.lesson_content,
      order: data.order,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return await db.createQuestion(question);
  }

  /**
   * Update question (admin only)
   */
  async updateQuestion(
    questionId: string,
    updates: Partial<CreateQuestionDTO>
  ): Promise<Question | null> {
    // Validate if updating options and correct answer
    if (updates.options && updates.correct_answer) {
      const validAnswers = updates.options.map(o => o.label);
      if (!validAnswers.includes(updates.correct_answer)) {
        throw new Error('Correct answer must match one of the option labels');
      }
    }

    const question = await db.updateQuestion(questionId, updates);
    return question || null;
  }

  /**
   * Delete question (admin only)
   */
  async deleteQuestion(questionId: string): Promise<boolean> {
    return await db.deleteQuestion(questionId);
  }

  /**
   * Bulk create questions (admin only)
   */
  async bulkCreateQuestions(questions: CreateQuestionDTO[]): Promise<Question[]> {
    const newQuestions: Question[] = questions.map((data, index) => {
      // Validate each question
      if (data.options.length < 2) {
        throw new Error(`Question ${index + 1}: Must have at least 2 options`);
      }

      const validAnswers = data.options.map(o => o.label);
      if (!validAnswers.includes(data.correct_answer)) {
        throw new Error(`Question ${index + 1}: Correct answer must match one of the option labels`);
      }

      return {
        id: this.generateId(),
        sheet_id: data.sheet_id,
        question_text: data.question_text,
        image_url: data.image_url,
        options: data.options,
        correct_answer: data.correct_answer,
        explanation: data.explanation,
        lesson_content: data.lesson_content,
        order: data.order,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    return await db.bulkCreateQuestions(newQuestions);
  }

  /**
   * Reorder questions in a sheet (admin only)
   */
  async reorderQuestions(
    sheetId: string,
    questionIds: string[]
  ): Promise<Question[]> {
    const questions = await db.getQuestionsBySheetId(sheetId);

    // Verify all question IDs belong to this sheet
    const sheetQuestionIds = questions.map(q => q.id);
    const invalidIds = questionIds.filter(id => !sheetQuestionIds.includes(id));
    if (invalidIds.length > 0) {
      throw new Error(`Invalid question IDs: ${invalidIds.join(', ')}`);
    }

    // Update order for each question
    const updates = questionIds.map((id, index) =>
      db.updateQuestion(id, { order: index + 1 })
    );

    await Promise.all(updates);

    // Return updated questions
    return await db.getQuestionsBySheetId(sheetId);
  }

  /**
   * Duplicate question (admin only)
   */
  async duplicateQuestion(questionId: string): Promise<Question> {
    const original = await db.findQuestionById(questionId);
    if (!original) {
      throw new Error('Question not found');
    }

    // Get all questions in the sheet to determine new order
    const sheetQuestions = await db.getQuestionsBySheetId(original.sheet_id);
    const maxOrder = Math.max(...sheetQuestions.map(q => q.order), 0);

    const newQuestion: Question = {
      ...original,
      id: this.generateId(),
      order: maxOrder + 1,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return await db.createQuestion(newQuestion);
  }

  /**
   * Get question with user's answer (if exists)
   */
  async getQuestionWithUserAnswer(
    questionId: string,
    userId: string
  ): Promise<{
    question: Question;
    user_answer?: string;
    is_correct?: boolean;
  } | null> {
    const question = await db.findQuestionById(questionId);
    if (!question) return null;

    const progress = await db.getUserProgress(userId, question.sheet_id);
    const userProgress = progress.find(p => p.question_id === questionId);

    return {
      question,
      user_answer: userProgress?.user_answer,
      is_correct: userProgress?.is_correct,
    };
  }

  /**
   * Import questions from CSV data (admin only)
   * Expected CSV format: question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,lesson_content
   */
  async importQuestionsFromCSV(
    sheetId: string,
    csvData: string
  ): Promise<Question[]> {
    const lines = csvData.trim().split('\n');
    
    // Skip header row
    const dataLines = lines.slice(1);

    const questions: CreateQuestionDTO[] = dataLines.map((line, index) => {
      const parts = this.parseCSVLine(line);
      
      if (parts.length < 8) {
        throw new Error(`Line ${index + 2}: Invalid CSV format. Expected 8 columns.`);
      }

      const [
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        explanation,
        lesson_content,
      ] = parts;

      return {
        sheet_id: sheetId,
        question_text: question_text.trim(),
        options: [
          { label: 'A', text: option_a.trim() },
          { label: 'B', text: option_b.trim() },
          { label: 'C', text: option_c.trim() },
          { label: 'D', text: option_d.trim() },
        ],
        correct_answer: correct_answer.trim().toUpperCase(),
        explanation: explanation.trim(),
        lesson_content: lesson_content.trim(),
        order: index + 1,
      };
    });

    return await this.bulkCreateQuestions(questions);
  }

  /**
   * Parse CSV line handling quoted fields
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Export questions to CSV format (admin only)
   */
  async exportQuestionsToCSV(sheetId: string): Promise<string> {
    const questions = await db.getQuestionsBySheetId(sheetId);

    const header = 'question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,lesson_content\n';
    
    const rows = questions.map(q => {
      const optionA = q.options.find(o => o.label === 'A')?.text || '';
      const optionB = q.options.find(o => o.label === 'B')?.text || '';
      const optionC = q.options.find(o => o.label === 'C')?.text || '';
      const optionD = q.options.find(o => o.label === 'D')?.text || '';

      return [
        this.escapeCSV(q.question_text),
        this.escapeCSV(optionA),
        this.escapeCSV(optionB),
        this.escapeCSV(optionC),
        this.escapeCSV(optionD),
        q.correct_answer,
        this.escapeCSV(q.explanation),
        this.escapeCSV(q.lesson_content),
      ].join(',');
    });

    return header + rows.join('\n');
  }

  /**
   * Escape CSV field
   */
  private escapeCSV(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  /**
   * Get question statistics
   */
  async getQuestionStats(questionId: string) {
    const question = await db.findQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Get all user progress for this question
    const allProgress = await db.getUserProgress('', question.sheet_id);
    const questionProgress = allProgress.filter(p => p.question_id === questionId);

    const totalAttempts = questionProgress.length;
    const correctAttempts = questionProgress.filter(p => p.is_correct).length;
    const accuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    // Count answer distribution
    const answerDistribution = new Map<string, number>();
    questionProgress.forEach(p => {
      const count = answerDistribution.get(p.user_answer) || 0;
      answerDistribution.set(p.user_answer, count + 1);
    });

    return {
      question_id: questionId,
      total_attempts: totalAttempts,
      correct_attempts: correctAttempts,
      accuracy,
      answer_distribution: Object.fromEntries(answerDistribution),
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const questionService = new QuestionService();
