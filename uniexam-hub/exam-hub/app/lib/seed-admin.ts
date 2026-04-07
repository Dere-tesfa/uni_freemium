// Seed Admin User Script
// Run this to create a default admin user for testing

import { db } from './db';
import type { User } from './types';

export async function seedAdminUser() {
  const adminPhone = '+251912345678';
  
  // Check if admin already exists
  const existing = await db.findUserByPhone(adminPhone);
  if (existing) {
    console.log('Admin user already exists');
    return existing;
  }

  // Create admin user
  const admin: User = {
    id: `admin_${Date.now()}`,
    phone: adminPhone,
    email: 'admin@uniexam.com',
    password_hash: 'hashed_admin123', // Password: admin123
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  };

  await db.createUser(admin);
  console.log('Admin user created successfully!');
  console.log('Phone:', adminPhone);
  console.log('Password: admin123');
  
  return admin;
}

// Auto-seed on import in development
if (typeof window === 'undefined') {
  seedAdminUser().catch(console.error);
}
