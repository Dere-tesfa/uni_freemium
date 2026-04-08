// Authentication Service
// Server-side only - handles JWT, password hashing, and authentication logic

import { db } from '../lib/db';
import type { 
  User, 
  CreateUserDTO, 
  LoginDTO, 
  AuthResponse 
} from '../lib/types';
import jwt from 'jsonwebtoken';

// In production, use proper crypto libraries
// For now, using simple implementations
class AuthService {
  private JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private JWT_EXPIRES_IN = '7d'; // 7 days

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    return await bcrypt.hash(password, 10);
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    ) as string;
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): { userId: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return decoded as { userId: string; role: string };
    } catch (error) {
      return null;
    }
  }

  /**
   * Register a new user
   */
  async register(data: CreateUserDTO): Promise<AuthResponse> {
    // Validate phone number format (Ethiopian format)
    if (!this.isValidEthiopianPhone(data.phone)) {
      throw new Error('Invalid phone number format. Use Ethiopian format: +251XXXXXXXXX');
    }

    // Check if user already exists
    const existingUser = await db.findUserByPhone(data.phone);
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    // Hash password
    const password_hash = await this.hashPassword(data.password);

    // Create user
    const user: User = {
      id: this.generateId(),
      phone: data.phone,
      email: data.email,
      password_hash,
      role: data.role || 'student',
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db.createUser(user);

    // Generate token
    const token = this.generateToken(user.id, user.role);

    // Return user without password
    const { password_hash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by phone
    let user = await db.findUserByPhone(data.phone);
    if (!user) {
      // the front-end login form actually passes email in the `phone` field or `email` field
      // we'll try treating data.phone as email
      user = await db.findUserByEmail(data.phone);
    }
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await this.verifyPassword(data.password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid phone number or password');
    }

    // Generate token
    const token = this.generateToken(user.id, user.role);

    // Return user without password
    const { password_hash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Get user from token
   */
  async getUserFromToken(token: string): Promise<Omit<User, 'password_hash'> | null> {
    const decoded = this.verifyToken(token);
    if (!decoded) return null;

    const user = await db.findUserById(decoded.userId);
    if (!user) return null;

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Validate Ethiopian phone number
   * Format: +251XXXXXXXXX (9 digits after country code)
   */
  private isValidEthiopianPhone(phone: string): boolean {
    const phoneRegex = /^\+251[79]\d{8}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Generate unique ID
   * In production, use UUID library
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string, 
    oldPassword: string, 
    newPassword: string
  ): Promise<void> {
    const user = await db.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValid = await this.verifyPassword(oldPassword, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid current password');
    }

    // Hash new password
    const password_hash = await this.hashPassword(newPassword);

    // Update user
    await db.updateUser(userId, { password_hash });
  }

  /**
   * Reset password (admin only)
   */
  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const user = await db.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Hash new password
    const password_hash = await this.hashPassword(newPassword);

    // Update user
    await db.updateUser(userId, { password_hash });
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader) return null;
    
    // Format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }

  /**
   * Middleware helper: Get authenticated user from request
   */
  async authenticateRequest(authHeader: string | null): Promise<Omit<User, 'password_hash'>> {
    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const user = await this.getUserFromToken(token);
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    return user;
  }

  /**
   * Middleware helper: Check if user is admin
   */
  async requireAdmin(authHeader: string | null): Promise<Omit<User, 'password_hash'>> {
    const user = await this.authenticateRequest(authHeader);
    
    if (user.role !== 'admin') {
      throw new Error('Admin access required');
    }

    return user;
  }
}

// Export singleton instance
export const authService = new AuthService();
