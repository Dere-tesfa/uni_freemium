// Sheet Service
// Server-side only - handles exam sheet management

import { db } from '../lib/db';
import type { 
  Sheet, 
  CreateSheetDTO, 
  SheetWithQuestions,
  SheetWithAccess 
} from '../lib/types';

class SheetService {
  /**
   * Get all published sheets
   */
  async getPublishedSheets(filters?: {
    department?: string;
    university?: string;
    exam_type?: string;
  }): Promise<Sheet[]> {
    return await db.getAllSheets({
      ...filters,
      is_published: true,
    });
  }

  /**
   * Get all sheets (admin only - includes unpublished)
   */
  async getAllSheets(filters?: {
    department?: string;
    university?: string;
    is_published?: boolean;
  }): Promise<Sheet[]> {
    return await db.getAllSheets(filters);
  }

  /**
   * Get sheet by ID
   */
  async getSheetById(sheetId: string): Promise<Sheet | null> {
    const sheet = await db.findSheetById(sheetId);
    return sheet || null;
  }

  /**
   * Get sheet with questions
   */
  async getSheetWithQuestions(sheetId: string): Promise<SheetWithQuestions | null> {
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) return null;

    const questions = await db.getQuestionsBySheetId(sheetId);

    return {
      ...sheet,
      questions,
      question_count: questions.length,
    };
  }

  /**
   * Get sheet with user access information
   */
  async getSheetWithAccess(
    sheetId: string,
    userId?: string
  ): Promise<SheetWithAccess | null> {
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) return null;

    let hasAccess = false;
    let purchase = undefined;

    if (userId) {
      // Check if sheet is free
      if (sheet.price === 0) {
        hasAccess = true;
      } else {
        // Check if user has purchased
        hasAccess = await db.checkUserAccess(userId, sheetId);
        if (hasAccess) {
          const purchases = await db.getPurchasesByUserId(userId);
          purchase = purchases.find(
            p => p.sheet_id === sheetId && p.status === 'approved'
          );
        } else {
          // Check for pending purchase
          const purchases = await db.getPurchasesByUserId(userId);
          purchase = purchases.find(
            p => p.sheet_id === sheetId && p.status === 'pending'
          );
        }
      }
    } else {
      // Guest user - only free sheets
      hasAccess = sheet.price === 0;
    }

    return {
      ...sheet,
      has_access: hasAccess,
      purchase,
    };
  }

  /**
   * Get sheet questions with access control
   * Returns limited questions if user doesn't have access
   */
  async getSheetQuestions(
    sheetId: string,
    userId?: string,
    limit?: number
  ) {
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    const questions = await db.getQuestionsBySheetId(sheetId);

    // Check access
    let hasAccess = false;
    if (sheet.price === 0) {
      hasAccess = true;
    } else if (userId) {
      hasAccess = await db.checkUserAccess(userId, sheetId);
    }

    // If no access, return limited questions (first 2)
    if (!hasAccess) {
      const limitedQuestions = questions.slice(0, limit || 2);
      return {
        sheet,
        questions: limitedQuestions,
        has_access: false,
        total_questions: questions.length,
        available_questions: limitedQuestions.length,
      };
    }

    return {
      sheet,
      questions,
      has_access: true,
      total_questions: questions.length,
      available_questions: questions.length,
    };
  }

  /**
   * Create new sheet (admin only)
   */
  async createSheet(data: CreateSheetDTO): Promise<Sheet> {
    const sheet: Sheet = {
      id: this.generateId(),
      title: data.title,
      course_code: data.course_code,
      university: data.university,
      department: data.department,
      year: data.year,
      exam_type: data.exam_type || "mid",
      semester: data.semester || "1",
      price: data.price,
      description: data.description,
      image_url: data.image_url || null,
      is_published: data.is_published ?? false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return await db.createSheet(sheet);
  }

  /**
   * Update sheet (admin only)
   */
  async updateSheet(
    sheetId: string,
    updates: Partial<CreateSheetDTO>
  ): Promise<Sheet | null> {
    const sheet = await db.updateSheet(sheetId, updates);
    return sheet || null;
  }

  /**
   * Delete sheet (admin only)
   */
  async deleteSheet(sheetId: string): Promise<boolean> {
    return await db.deleteSheet(sheetId);
  }

  /**
   * Publish/unpublish sheet (admin only)
   */
  async togglePublish(sheetId: string): Promise<Sheet | null> {
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) return null;

    const updated = await db.updateSheet(sheetId, {
      is_published: !sheet.is_published,
    });
    return updated || null;
  }

  /**
   * Get free sheets
   */
  async getFreeSheets(): Promise<Sheet[]> {
    const sheets = await db.getAllSheets({ is_published: true });
    return sheets.filter(s => s.price === 0);
  }

  /**
   * Get popular sheets (based on purchase count)
   */
  async getPopularSheets(limit: number = 10): Promise<Array<Sheet & { purchase_count: number }>> {
    const sheets = await db.getAllSheets({ is_published: true });
    const purchases = await db.getAllPurchases();

    // Count purchases for each sheet
    const sheetPurchaseCounts = new Map<string, number>();
    purchases
      .filter(p => p.status === 'approved')
      .forEach(purchase => {
        const count = sheetPurchaseCounts.get(purchase.sheet_id) || 0;
        sheetPurchaseCounts.set(purchase.sheet_id, count + 1);
      });

    // Add purchase count to sheets and sort
    const sheetsWithCounts = sheets
      .map(sheet => ({
        ...sheet,
        purchase_count: sheetPurchaseCounts.get(sheet.id) || 0,
      }))
      .sort((a, b) => b.purchase_count - a.purchase_count)
      .slice(0, limit);

    return sheetsWithCounts;
  }

  /**
   * Get new arrivals
   */
  async getNewArrivals(limit: number = 10): Promise<Sheet[]> {
    const sheets = await db.getAllSheets({ is_published: true });
    return sheets
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);
  }

  /**
   * Search sheets
   */
  async searchSheets(query: string): Promise<Sheet[]> {
    const sheets = await db.getAllSheets({ is_published: true });
    const lowerQuery = query.toLowerCase();

    return sheets.filter(sheet =>
      sheet.title.toLowerCase().includes(lowerQuery) ||
      sheet.course_code.toLowerCase().includes(lowerQuery) ||
      sheet.department.toLowerCase().includes(lowerQuery) ||
      sheet.university.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get sheets by department
   */
  async getSheetsByDepartment(department: string): Promise<Sheet[]> {
    return await db.getAllSheets({
      department,
      is_published: true,
    });
  }

  /**
   * Get sheets by university
   */
  async getSheetsByUniversity(university: string): Promise<Sheet[]> {
    return await db.getAllSheets({
      university,
      is_published: true,
    });
  }

  /**
   * Get unique departments
   */
  async getDepartments(): Promise<string[]> {
    const sheets = await db.getAllSheets({ is_published: true });
    const departments = new Set(sheets.map(s => s.department));
    return Array.from(departments).sort();
  }

  /**
   * Get unique universities
   */
  async getUniversities(): Promise<string[]> {
    const sheets = await db.getAllSheets({ is_published: true });
    const universities = new Set(sheets.map(s => s.university));
    return Array.from(universities).sort();
  }

  /**
   * Get sheet statistics
   */
  async getSheetStats(sheetId: string) {
    const sheet = await db.findSheetById(sheetId);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    const questions = await db.getQuestionsBySheetId(sheetId);
    const purchases = await db.getAllPurchases();
    const sheetPurchases = purchases.filter(p => p.sheet_id === sheetId);

    const totalPurchases = sheetPurchases.filter(p => p.status === 'approved').length;
    const pendingPurchases = sheetPurchases.filter(p => p.status === 'pending').length;
    const totalRevenue = sheetPurchases
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      sheet_id: sheetId,
      title: sheet.title,
      question_count: questions.length,
      total_purchases: totalPurchases,
      pending_purchases: pendingPurchases,
      total_revenue: totalRevenue,
      price: sheet.price,
    };
  }

  /**
   * Duplicate sheet (admin only)
   */
  async duplicateSheet(sheetId: string): Promise<Sheet> {
    const originalSheet = await db.findSheetById(sheetId);
    if (!originalSheet) {
      throw new Error('Sheet not found');
    }

    const questions = await db.getQuestionsBySheetId(sheetId);

    // Create new sheet
    const newSheet: Sheet = {
      ...originalSheet,
      id: this.generateId(),
      title: `${originalSheet.title} (Copy)`,
      is_published: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db.createSheet(newSheet);

    // Duplicate questions
    const newQuestions = questions.map(q => ({
      ...q,
      id: this.generateId(),
      sheet_id: newSheet.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await db.bulkCreateQuestions(newQuestions);

    return newSheet;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const sheetService = new SheetService();
