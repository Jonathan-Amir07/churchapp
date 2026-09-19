const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with mock accounts for testing...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const roles = ['student', 'parent', 'instructor', 'admin', 'priest'];

  for (const role of roles) {
    const user = await prisma.user.upsert({
      where: { username: `test_${role}` },
      update: {},
      create: {
        username: `test_${role}`,
        email: `test_${role}@joyfulpath.com`,
        passwordHash,
        firstName: 'Test',
        lastName: role.charAt(0).toUpperCase() + role.slice(1),
        displayName: `Test ${role}`,
        role: role,
        isProfileComplete: true,
        isActive: true,
        forcePasswordChange: false,
      },
    });
    console.log(`Created mock account: ${user.username} / password123`);
  }

  // Assign a child to the parent family for testing
  const parent = await prisma.user.findUnique({ where: { username: 'test_parent' } });
  const student = await prisma.user.findUnique({ where: { username: 'test_student' } });

  if (parent && student) {
    const family = await prisma.family.create({
      data: {
        name: 'Test Family',
        fatherId: parent.id,
      },
    });

    await prisma.user.update({
      where: { id: student.id },
      data: { familyId: family.id },
    });
    console.log('Assigned test_student to test_parent family.');
  }

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
