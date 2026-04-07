import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPhone = '+251912345678';
  const adminEmail = 'admin@uniexam.com';
  const adminPassword = 'admin123';

  // Check if admin already exists
  const existing = await prisma.user.findUnique({ where: { phone: adminPhone } });
  if (existing) {
    console.log('✅ Admin user already exists, skipping seed.');
    return;
  }

  // Hash the password properly with bcrypt
  const password_hash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      phone: adminPhone,
      email: adminEmail,
      password_hash,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created!');
  console.log('   Phone:    ', adminPhone);
  console.log('   Email:    ', adminEmail);
  console.log('   Password: ', adminPassword);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
