import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@joyfulpath.com' },
    update: {},
    create: {
      email: 'admin@joyfulpath.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'System Admin',
      passwordHash: adminPassword,
      role: UserRole.admin,
      locale: 'ar',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Add more seed data here as needed (classes, rewards, etc.)

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
