const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/joyfulpath?schema=public';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo accounts...');

  // Demo account credentials — matches frontend Quick Login UI
  const sharedPasswordHash = bcrypt.hashSync('demo123', 10);

  // Helper: upsert user by username (idempotent)
  async function upsertUser(data) {
    return prisma.user.upsert({
      where: { username: data.username },
      update: { passwordHash: data.passwordHash },
      create: data,
    });
  }

  // 1. Priest / Senior Admin Account
  const priest = await upsertUser({
    username: 'test_priest',
    email: 'priest@joyfulpath.org',
    passwordHash: sharedPasswordHash,
    firstName: 'Abouna',
    lastName: 'Markos',
    displayName: 'Father Markos',
    role: 'priest',
    locale: 'ar',
    isActive: true,
    accountStatus: 'active',
    forcePasswordChange: false,
  });

  // 2. Admin Account
  const admin = await upsertUser({
    username: 'test_admin',
    email: 'admin@joyfulpath.org',
    passwordHash: sharedPasswordHash,
    firstName: 'George',
    lastName: 'Bishop',
    displayName: 'George Bishop',
    role: 'admin',
    locale: 'ar',
    isActive: true,
    accountStatus: 'active',
    forcePasswordChange: false,
  });

  // 3. Instructor Account
  const instructor = await upsertUser({
    username: 'test_instructor',
    email: 'instructor@joyfulpath.org',
    passwordHash: sharedPasswordHash,
    firstName: 'Peter',
    lastName: 'Mark',
    displayName: 'Peter Mark',
    role: 'instructor',
    locale: 'ar',
    isActive: true,
    accountStatus: 'active',
    forcePasswordChange: false,
  });

  // 4. Student Account
  const student = await upsertUser({
    username: 'test_student',
    email: 'student@joyfulpath.org',
    passwordHash: sharedPasswordHash,
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
  });

  // 5. Parent Account
  const parent = await upsertUser({
    username: 'test_parent',
    email: 'parent@joyfulpath.org',
    passwordHash: sharedPasswordHash,
    firstName: 'Samuel',
    lastName: 'Amir',
    displayName: 'Samuel Amir',
    role: 'parent',
    locale: 'ar',
    isActive: true,
    accountStatus: 'active',
    forcePasswordChange: false,
  });

  console.log('  ✅ 5 Demo Users upserted:', {
    priest: priest.username,
    admin: admin.username,
    instructor: instructor.username,
    parent: parent.username,
    student: student.username,
  });

  // Create Family to link Parent and Student (idempotent)
  let family = await prisma.family.findFirst({ where: { name: 'Amir Family' } });
  if (!family) {
    family = await prisma.family.create({
      data: {
        name: 'Amir Family',
        fatherId: parent.id,
      }
    });
  }

  // Update Student with Family ID
  await prisma.user.update({
    where: { id: student.id },
    data: { familyId: family.id }
  });

  // Church & Branch (idempotent)
  let church = await prisma.church.findFirst({ where: { name: 'St. Mark Coptic Orthodox Church' } });
  if (!church) {
    church = await prisma.church.create({
      data: {
        name: 'St. Mark Coptic Orthodox Church',
        isActive: true,
      },
    });
  }

  let branch1 = await prisma.branch.findFirst({ where: { name: 'Main Cairo Cathedral' } });
  if (!branch1) {
    branch1 = await prisma.branch.create({
      data: {
        churchId: church.id,
        name: 'Main Cairo Cathedral',
        isActive: true,
      },
    });
  }

  // Classes (idempotent)
  let class1 = await prisma.class.findFirst({ where: { name: 'St. George Class (Grade 5)' } });
  if (!class1) {
    class1 = await prisma.class.create({
      data: {
        name: 'St. George Class (Grade 5)',
        academicYear: '2026',
        createdBy: instructor.id,
        isActive: true,
        maxStudents: 30,
      },
    });
  }

  // Assign instructor and student to class (idempotent)
  const existingMembers = await prisma.classMember.findMany({ where: { classId: class1.id } });
  if (existingMembers.length === 0) {
    await prisma.classMember.createMany({
      data: [
        { classId: class1.id, userId: student.id, role: 'student' },
        { classId: class1.id, userId: instructor.id, role: 'instructor' },
      ],
    });
  }

  // Lessons (idempotent)
  let lesson1 = await prisma.lesson.findFirst({ where: { title: 'The Story of Creation' } });
  if (!lesson1) {
    lesson1 = await prisma.lesson.create({
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
  }

  // Lesson Progress (idempotent)
  const existingProgress = await prisma.lessonProgress.findFirst({ where: { lessonId: lesson1.id, userId: student.id } });
  if (!existingProgress) {
    await prisma.lessonProgress.create({
      data: { lessonId: lesson1.id, userId: student.id, status: 'completed', progressPct: 100 },
    });
  }

  // Attendance (idempotent)
  const existingAttendance = await prisma.attendance.findFirst({ where: { classId: class1.id, userId: student.id } });
  if (!existingAttendance) {
    await prisma.attendance.create({
      data: { classId: class1.id, userId: student.id, recordedBy: instructor.id, date: new Date('2026-06-28'), status: 'present', notes: 'Great participation' },
    });
  }

  // Tasks (idempotent)
  let task1 = await prisma.task.findFirst({ where: { title: 'Memorize Genesis 1:1' } });
  if (!task1) {
    task1 = await prisma.task.create({
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
  }

  const existingSubmission = await prisma.taskSubmission.findFirst({ where: { taskId: task1.id, studentId: student.id } });
  if (!existingSubmission) {
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
  }

  // Quizzes (idempotent)
  let quiz1 = await prisma.quiz.findFirst({ where: { title: 'Creation Review Quiz' } });
  if (!quiz1) {
    quiz1 = await prisma.quiz.create({
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
  }

  // Rewards (idempotent)
  const existingReward = await prisma.reward.findFirst({ where: { title: 'Holy Cross Keychain' } });
  if (!existingReward) {
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
  }

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
