// Payment Service
// Server-side only - handles manual payment verification system

import { db } from '../lib/db';
import type { 
  Purchase, 
  CreatePurchaseDTO, 
  UpdatePurchaseStatusDTO 
} from '../lib/types';

class PaymentService {
  /**
   * Create a new payment request
   */
  async createPaymentRequest(data: CreatePurchaseDTO): Promise<Purchase> {
    // Check if sheet exists
    const sheet = await db.findSheetById(data.sheet_id);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    // Check if user already has access
    const hasAccess = await db.checkUserAccess(data.user_id, data.sheet_id);
    if (hasAccess) {
      throw new Error('You already have access to this sheet');
    }

    // Check if there's already a pending request
    const userPurchases = await db.getPurchasesByUserId(data.user_id);
    const pendingPurchase = userPurchases.find(
      p => p.sheet_id === data.sheet_id && p.status === 'pending'
    );

    if (pendingPurchase) {
      throw new Error('You already have a pending payment request for this sheet');
    }

    // Verify amount matches sheet price
    if (data.amount !== sheet.price) {
      throw new Error(`Payment amount (${data.amount} ETB) does not match sheet price (${sheet.price} ETB)`);
    }

    const purchase: Purchase = {
      id: this.generateId(),
      user_id: data.user_id,
      sheet_id: data.sheet_id,
      status: 'pending',
      screenshot_url: data.screenshot_url,
      amount: data.amount,
      created_at: new Date(),
    };

    return await db.createPurchase(purchase);
  }

  /**
   * Get payment request by ID
   */
  async getPaymentById(paymentId: string): Promise<Purchase | null> {
    const payment = await db.findPurchaseById(paymentId);
    return payment || null;
  }

  /**
   * Get all pending payment requests (admin only)
   */
  async getPendingPayments(): Promise<Array<Purchase & {
    user_phone?: string;
    sheet_title?: string;
  }>> {
    const pendingPayments = await db.getPurchasesByStatus('pending');

    // Enrich with user and sheet information
    const enrichedPayments = await Promise.all(
      pendingPayments.map(async (payment) => {
        const user = await db.findUserById(payment.user_id);
        const sheet = await db.findSheetById(payment.sheet_id);

        return {
          ...payment,
          user_phone: user?.phone,
          sheet_title: sheet?.title,
        };
      })
    );

    // Sort by creation date (oldest first)
    return enrichedPayments.sort(
      (a, b) => a.created_at.getTime() - b.created_at.getTime()
    );
  }

  /**
   * Get all payment requests (admin only)
   */
  async getAllPayments(filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    user_id?: string;
    sheet_id?: string;
  }): Promise<Purchase[]> {
    let payments = await db.getAllPurchases();

    if (filters?.status) {
      payments = payments.filter(p => p.status === filters.status);
    }

    if (filters?.user_id) {
      payments = payments.filter(p => p.user_id === filters.user_id);
    }

    if (filters?.sheet_id) {
      payments = payments.filter(p => p.sheet_id === filters.sheet_id);
    }

    return payments.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  /**
   * Get user's payment history
   */
  async getUserPayments(userId: string): Promise<Array<Purchase & {
    sheet_title?: string;
    sheet_course_code?: string;
  }>> {
    const payments = await db.getPurchasesByUserId(userId);

    // Enrich with sheet information
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        const sheet = await db.findSheetById(payment.sheet_id);

        return {
          ...payment,
          sheet_title: sheet?.title,
          sheet_course_code: sheet?.course_code,
        };
      })
    );

    return enrichedPayments.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );
  }

  /**
   * Approve payment request (admin only)
   */
  async approvePayment(paymentId: string): Promise<Purchase> {
    const payment = await db.findPurchaseById(paymentId);
    if (!payment) {
      throw new Error('Payment request not found');
    }

    if (payment.status !== 'pending') {
      throw new Error(`Payment is already ${payment.status}`);
    }

    const updated = await db.updatePurchase(paymentId, {
      status: 'approved',
      approved_at: new Date(),
    });

    if (!updated) {
      throw new Error('Failed to update payment');
    }

    // TODO: Send notification to user (email/SMS/in-app)
    // await this.notifyUser(payment.user_id, 'approved', payment.sheet_id);

    return updated;
  }

  /**
   * Reject payment request (admin only)
   */
  async rejectPayment(
    paymentId: string,
    reason: string
  ): Promise<Purchase> {
    const payment = await db.findPurchaseById(paymentId);
    if (!payment) {
      throw new Error('Payment request not found');
    }

    if (payment.status !== 'pending') {
      throw new Error(`Payment is already ${payment.status}`);
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('Rejection reason is required');
    }

    const updated = await db.updatePurchase(paymentId, {
      status: 'rejected',
      rejection_reason: reason,
      rejected_at: new Date(),
    });

    if (!updated) {
      throw new Error('Failed to update payment');
    }

    // TODO: Send notification to user with rejection reason
    // await this.notifyUser(payment.user_id, 'rejected', payment.sheet_id, reason);

    return updated;
  }

  /**
   * Update payment screenshot (user can resubmit if rejected)
   */
  async updatePaymentScreenshot(
    paymentId: string,
    userId: string,
    screenshotUrl: string
  ): Promise<Purchase> {
    const payment = await db.findPurchaseById(paymentId);
    if (!payment) {
      throw new Error('Payment request not found');
    }

    // Verify ownership
    if (payment.user_id !== userId) {
      throw new Error('Unauthorized: This payment request does not belong to you');
    }

    // Only allow updating if rejected or pending
    if (payment.status === 'approved') {
      throw new Error('Cannot update an approved payment');
    }

    const updated = await db.updatePurchase(paymentId, {
      screenshot_url: screenshotUrl,
      status: 'pending', // Reset to pending if it was rejected
      rejection_reason: undefined,
      rejected_at: undefined,
    });

    if (!updated) {
      throw new Error('Failed to update payment');
    }

    return updated;
  }

  /**
   * Cancel payment request (user can cancel pending requests)
   */
  async cancelPayment(paymentId: string, userId: string): Promise<boolean> {
    const payment = await db.findPurchaseById(paymentId);
    if (!payment) {
      throw new Error('Payment request not found');
    }

    // Verify ownership
    if (payment.user_id !== userId) {
      throw new Error('Unauthorized: This payment request does not belong to you');
    }

    // Only allow canceling pending requests
    if (payment.status !== 'pending') {
      throw new Error('Can only cancel pending payment requests');
    }

    const updated = await db.updatePurchase(paymentId, {
      status: 'rejected',
      rejection_reason: 'Cancelled by user',
      rejected_at: new Date(),
    });

    return !!updated;
  }

  /**
   * Get payment statistics (admin only)
   */
  async getPaymentStats(filters?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const allPayments = await db.getAllPurchases();

    let filteredPayments = allPayments;

    if (filters?.startDate) {
      filteredPayments = filteredPayments.filter(
        p => p.created_at >= filters.startDate!
      );
    }

    if (filters?.endDate) {
      filteredPayments = filteredPayments.filter(
        p => p.created_at <= filters.endDate!
      );
    }

    const pending = filteredPayments.filter(p => p.status === 'pending');
    const approved = filteredPayments.filter(p => p.status === 'approved');
    const rejected = filteredPayments.filter(p => p.status === 'rejected');

    const totalRevenue = approved.reduce((sum, p) => sum + p.amount, 0);
    const averagePayment = approved.length > 0 
      ? totalRevenue / approved.length 
      : 0;

    // Calculate average approval time
    const approvalTimes = approved
      .filter(p => p.approved_at)
      .map(p => {
        const approvedAt = p.approved_at!.getTime();
        const createdAt = p.created_at.getTime();
        return approvedAt - createdAt;
      });

    const averageApprovalTime = approvalTimes.length > 0
      ? approvalTimes.reduce((sum, time) => sum + time, 0) / approvalTimes.length
      : 0;

    // Convert to hours
    const averageApprovalHours = Math.round(averageApprovalTime / (1000 * 60 * 60));

    return {
      total_requests: filteredPayments.length,
      pending_count: pending.length,
      approved_count: approved.length,
      rejected_count: rejected.length,
      total_revenue: totalRevenue,
      average_payment: Math.round(averagePayment),
      average_approval_hours: averageApprovalHours,
      approval_rate: filteredPayments.length > 0
        ? Math.round((approved.length / filteredPayments.length) * 100)
        : 0,
    };
  }

  /**
   * Get recent payment activity (admin dashboard)
   */
  async getRecentActivity(limit: number = 10): Promise<Array<{
    payment: Purchase;
    user_phone?: string;
    sheet_title?: string;
    action: string;
    timestamp: Date;
  }>> {
    const allPayments = await db.getAllPurchases();

    // Sort by most recent activity
    const sortedPayments = allPayments.sort((a, b) => {
      const aTime = a.approved_at || a.rejected_at || a.created_at;
      const bTime = b.approved_at || b.rejected_at || b.created_at;
      return bTime.getTime() - aTime.getTime();
    });

    const recentPayments = sortedPayments.slice(0, limit);

    // Enrich with user and sheet information
    const enrichedActivity = await Promise.all(
      recentPayments.map(async (payment) => {
        const user = await db.findUserById(payment.user_id);
        const sheet = await db.findSheetById(payment.sheet_id);

        let action = 'Payment requested';
        let timestamp = payment.created_at;

        if (payment.status === 'approved' && payment.approved_at) {
          action = 'Payment approved';
          timestamp = payment.approved_at;
        } else if (payment.status === 'rejected' && payment.rejected_at) {
          action = 'Payment rejected';
          timestamp = payment.rejected_at;
        }

        return {
          payment,
          user_phone: user?.phone,
          sheet_title: sheet?.title,
          action,
          timestamp,
        };
      })
    );

    return enrichedActivity;
  }

  /**
   * Bulk approve payments (admin only)
   */
  async bulkApprovePayments(paymentIds: string[]): Promise<{
    approved: number;
    failed: number;
    errors: string[];
  }> {
    let approved = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const paymentId of paymentIds) {
      try {
        await this.approvePayment(paymentId);
        approved++;
      } catch (error) {
        failed++;
        errors.push(`${paymentId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { approved, failed, errors };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * TODO: Implement notification system
   * This would send notifications via email, SMS, or in-app
   */
  private async notifyUser(
    userId: string,
    status: 'approved' | 'rejected',
    sheetId: string,
    reason?: string
  ): Promise<void> {
    // Placeholder for notification logic
    // In production, integrate with:
    // - Email service (SendGrid, AWS SES)
    // - SMS service (Twilio, African SMS providers)
    // - Push notifications
    // - Telegram bot
    console.log(`Notify user ${userId}: Payment ${status} for sheet ${sheetId}`, reason);
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
