const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock users for testing...');
  const passHash = await bcrypt.hash('password123', 10);

  const usersToSeed = [
    {
      email: 'student@joyfulpath.com',
      username: 'student1',
      firstName: 'Test',
      lastName: 'Student',
      displayName: 'Test Student',
      passwordHash: passHash,
      role: 'student',
      locale: 'en',
    },
    {
      email: 'parent@joyfulpath.com',
      username: 'parent1',
      firstName: 'Test',
      lastName: 'Parent',
      displayName: 'Test Parent',
      passwordHash: passHash,
      role: 'parent',
      locale: 'en',
    },
    {
      email: 'instructor@joyfulpath.com',
      username: 'instructor1',
      firstName: 'Test',
      lastName: 'Instructor',
      displayName: 'Test Instructor',
      passwordHash: passHash,
      role: 'instructor',
      locale: 'en',
    },
    {
      email: 'priest@joyfulpath.com',
      username: 'priest1',
      firstName: 'Test',
      lastName: 'Priest',
      displayName: 'Test Priest',
      passwordHash: passHash,
      role: 'priest',
      locale: 'en',
    }
  ];

  for (const user of usersToSeed) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`Created user: ${user.username} with role ${user.role}`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
