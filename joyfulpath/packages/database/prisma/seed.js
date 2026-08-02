const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

process.env.DATABASE_URL = 'file:./prisma/dev.db';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo accounts...');

  // Clear existing data safely
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF');
  await prisma.user.deleteMany();
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');

  // Demo account credentials as requested
  const priestHash = bcrypt.hashSync('Priest@123', 10);
  const adminHash = bcrypt.hashSync('Admin@123', 10);
  const instructorHash = bcrypt.hashSync('Instructor@123', 10);
  const parentHash = bcrypt.hashSync('Parent@123', 10);
  const studentHash = bcrypt.hashSync('Student@123', 10);

  // 1. Priest / Senior Admin Account
  const priest = await prisma.user.create({
    data: {
      username: 'priest',
      email: 'priest@joyfulpath.org',
      passwordHash: priestHash,
      firstName: 'Abouna',
      lastName: 'Markos',
      displayName: 'Father Markos',
      role: 'priest',
      locale: 'ar',
      isActive: true,
      accountStatus: 'active',
      forcePasswordChange: false,
    },
  });

  // 2. Admin Account
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@joyfulpath.org',
      passwordHash: adminHash,
      firstName: 'George',
      lastName: 'Bishop',
      displayName: 'George Bishop',
      role: 'admin',
      locale: 'ar',
      isActive: true,
      accountStatus: 'active',
      forcePasswordChange: false,
    },
  });

  // 3. Instructor Account
  const instructor = await prisma.user.create({
    data: {
      username: 'instructor',
      email: 'instructor@joyfulpath.org',
      passwordHash: instructorHash,
      firstName: 'Peter',
      lastName: 'Mark',
      displayName: 'Peter Mark',
      role: 'instructor',
      locale: 'ar',
      isActive: true,
      accountStatus: 'active',
      forcePasswordChange: false,
    },
  });

  // 4. Student Account
  const student = await prisma.user.create({
    data: {
      username: 'student',
      email: 'student@joyfulpath.org',
      passwordHash: studentHash,
      firstName: 'Jonathan',
      lastName: 'Junior',
      displayName: 'Jonathan Junior',
      role: 'student',
      locale: 'ar',
      totalXp: 1250,
      totalPoints: 120,
      currentStreak: 5,
      longestStreak: 10,
      isActive: true,
      accountStatus: 'active',
      forcePasswordChange: false,
    },
  });

  // 5. Parent Account
  const parent = await prisma.user.create({
    data: {
      username: 'parent',
      email: 'parent@joyfulpath.org',
      passwordHash: parentHash,
      firstName: 'Samuel',
      lastName: 'Amir',
      displayName: 'Samuel Amir',
      role: 'parent',
      locale: 'ar',
      isActive: true,
      accountStatus: 'active',
      forcePasswordChange: false,
    },
  });

  console.log('  ✅ 5 Demo Users created:', {
    priest: priest.username,
    admin: admin.username,
    instructor: instructor.username,
    parent: parent.username,
    student: student.username,
  });

  // Church & Branch
  const church = await prisma.church.create({
    data: {
      name: 'St. Mark Coptic Orthodox Church',
      isActive: true,
    },
  });

  const branch1 = await prisma.branch.create({
    data: {
      churchId: church.id,
      name: 'Main Cairo Cathedral',
      isActive: true,
    },
  });

  // Classes
  const class1 = await prisma.class.create({
    data: {
      name: 'St. George Class (Grade 5)',
      academicYear: '2026',
      createdBy: instructor.id,
      isActive: true,
      maxStudents: 30,
    },
  });

  // Assign instructor and student to class
  await prisma.classMember.createMany({
    data: [
      { classId: class1.id, userId: student.id, role: 'student' },
      { classId: class1.id, userId: instructor.id, role: 'instructor' },
    ],
  });

  // Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      classId: class1.id,
      title: 'The Story of Creation',
      description: 'Learn about how God created the heavens and the earth in six days.',
      content: 'In the beginning, God created the heavens and the earth.',
      bibleReferences: 'Genesis 1:1-31',
      status: 'published',
      xpReward: 50,
      pointsReward: 10,
      orderIndex: 1,
      createdBy: instructor.id,
    },
  });

  // Lesson Progress
  await prisma.lessonProgress.create({
    data: { lessonId: lesson1.id, userId: student.id, status: 'completed', progressPct: 100 },
  });

  // Attendance
  await prisma.attendance.create({
    data: { classId: class1.id, userId: student.id, recordedBy: instructor.id, date: new Date('2026-06-28'), status: 'present', notes: 'Great participation' },
  });

  // Tasks
  const task1 = await prisma.task.create({
    data: {
      classId: class1.id,
      title: 'Memorize Genesis 1:1',
      description: 'Memorize the first verse of Genesis.',
      taskType: 'memorization',
      status: 'active',
      xpReward: 30,
      pointsReward: 5,
      dueDate: new Date('2026-07-15'),
      createdBy: instructor.id,
    },
  });

  await prisma.taskSubmission.create({
    data: {
      taskId: task1.id,
      studentId: student.id,
      content: 'In the beginning God created the heavens and the earth.',
      status: 'approved',
      xpAwarded: 30,
      pointsAwarded: 5,
    },
  });

  // Quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      classId: class1.id,
      lessonId: lesson1.id,
      title: 'Creation Review Quiz',
      description: 'Test your knowledge about the creation story.',
      quizType: 'lesson_review',
      status: 'published',
      maxAttempts: 3,
      passingScore: 70,
      xpReward: 50,
      pointsReward: 10,
      createdBy: instructor.id,
    },
  });

  // Rewards
  await prisma.reward.create({
    data: {
      title: 'Holy Cross Keychain',
      description: 'A beautiful wooden cross keychain.',
      type: 'physical',
      costXp: 50,
      inventoryCount: 20,
      isActive: true,
      metadata: '{}',
    },
  });

  console.log('\n🎉 Database seeded with demo accounts successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
