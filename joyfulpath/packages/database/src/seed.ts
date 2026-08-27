import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with default JoyfulPath data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Upsert Admin User
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@joyfulpath.org',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      displayName: 'System Admin',
      role: 'admin',
      isProfileComplete: true,
      accountStatus: 'active',
      forcePasswordChange: false,
    },
  });

  // Upsert Student User
  const student = await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: {
      username: 'student',
      email: 'student@joyfulpath.org',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      role: 'student',
      isProfileComplete: true,
      accountStatus: 'active',
      forcePasswordChange: false,
    },
  });

  console.log('Seed completed successfully!');
  console.log('Admin login: admin / password123');
  console.log('Student login: student / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
