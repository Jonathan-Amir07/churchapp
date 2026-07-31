const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

process.env.DATABASE_URL = 'file:./dev.db';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.user.deleteMany();

  const hash = bcrypt.hashSync('password123', 10);

  // Users
  const admin = await prisma.user.create({
    data: {
      username: 'admin123',
      email: 'admin@joyfulpath.org',
      passwordHash: hash,
      firstName: 'George',
      lastName: 'Bishop',
      displayName: 'George Bishop',
      role: 'admin',
      locale: 'ar',
      isActive: true,
      accountStatus: 'active',
    },
  });

  const instructor = await prisma.user.create({
    data: {
      username: 'instructor123',
      email: 'instructor@joyfulpath.org',
      passwordHash: hash,
      firstName: 'Peter',
      lastName: 'Mark',
      displayName: 'Peter Mark',
      role: 'instructor',
      locale: 'ar',
      isActive: true,
      accountStatus: 'active',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      username: 'student123',
      email: 'student@joyfulpath.org',
      passwordHash: hash,
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
    },
  });

  const student2 = await prisma.user.create({
    data: {
      username: 'student456',
      email: 'student2@joyfulpath.org',
      passwordHash: hash,
      firstName: 'Mary',
      lastName: 'Grace',
      displayName: 'Mary Grace',
      role: 'student',
      locale: 'ar',
      totalXp: 780,
      totalPoints: 65,
      currentStreak: 2,
      longestStreak: 7,
      isActive: true,
      accountStatus: 'active',
    },
  });

  const parent = await prisma.user.create({
    data: {
      username: 'parent123',
      email: 'parent@joyfulpath.org',
      passwordHash: hash,
      firstName: 'Samuel',
      lastName: 'Amir',
      displayName: 'Samuel Amir',
      role: 'parent',
      locale: 'ar',
      isActive: true,
      accountStatus: 'active',
    },
  });

  console.log('  ✅ Users created:', { admin: admin.id, instructor: instructor.id, student1: student1.id, student2: student2.id, parent: parent.id });

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

  const branch2 = await prisma.branch.create({
    data: {
      churchId: church.id,
      name: 'Heliopolis Branch',
      isActive: true,
    },
  });

  console.log('  ✅ Church & Branches created');

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

  const class2 = await prisma.class.create({
    data: {
      name: 'St. Mary Class (Grade 6)',
      academicYear: '2026',
      createdBy: instructor.id,
      isActive: true,
      maxStudents: 30,
    },
  });

  // Add students to classes
  await prisma.classMember.createMany({
    data: [
      { classId: class1.id, userId: student1.id, role: 'student' },
      { classId: class1.id, userId: student2.id, role: 'student' },
      { classId: class2.id, userId: student1.id, role: 'student' },
      { classId: class1.id, userId: instructor.id, role: 'instructor' },
      { classId: class2.id, userId: instructor.id, role: 'instructor' },
    ],
  });

  console.log('  ✅ Classes & Members created');

  // Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      classId: class1.id,
      title: 'The Story of Creation',
      description: 'Learn about how God created the heavens and the earth in six days.',
      content: 'In the beginning, God created the heavens and the earth. The earth was formless and void...',
      bibleReferences: 'Genesis 1:1-31',
      status: 'published',
      xpReward: 50,
      pointsReward: 10,
      orderIndex: 1,
      createdBy: instructor.id,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      classId: class1.id,
      title: "Noah's Ark & The Rainbow Promise",
      description: 'The story of Noah, the great flood, and God\'s promise through the rainbow.',
      content: 'Noah was a righteous man, blameless among the people of his time, and he walked faithfully with God...',
      bibleReferences: 'Genesis 6-9',
      status: 'published',
      xpReward: 50,
      pointsReward: 10,
      orderIndex: 2,
      createdBy: instructor.id,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      classId: class1.id,
      title: 'Abraham — Father of Many Nations',
      description: 'The journey of Abraham and God\'s covenant with him.',
      content: 'God called Abram to leave his country and go to a land He would show him...',
      bibleReferences: 'Genesis 12-22',
      status: 'draft',
      xpReward: 50,
      pointsReward: 10,
      orderIndex: 3,
      createdBy: instructor.id,
    },
  });

  // Lesson Progress
  await prisma.lessonProgress.createMany({
    data: [
      { lessonId: lesson1.id, userId: student1.id, status: 'completed', progressPct: 100 },
      { lessonId: lesson2.id, userId: student1.id, status: 'in_progress', progressPct: 60 },
      { lessonId: lesson3.id, userId: student1.id, status: 'not_started', progressPct: 0 },
      { lessonId: lesson1.id, userId: student2.id, status: 'completed', progressPct: 100 },
      { lessonId: lesson2.id, userId: student2.id, status: 'in_progress', progressPct: 30 },
    ],
  });

  console.log('  ✅ Lessons & Progress created');

  // Attendance
  await prisma.attendance.createMany({
    data: [
      { classId: class1.id, userId: student1.id, recordedBy: instructor.id, date: new Date('2026-06-28'), status: 'present', notes: 'Excellent participation' },
      { classId: class1.id, userId: student1.id, recordedBy: instructor.id, date: new Date('2026-06-21'), status: 'present', notes: '' },
      { classId: class1.id, userId: student1.id, recordedBy: instructor.id, date: new Date('2026-06-14'), status: 'late', notes: 'Late by 10 mins' },
      { classId: class1.id, userId: student1.id, recordedBy: instructor.id, date: new Date('2026-06-07'), status: 'absent', notes: 'Sick' },
      { classId: class1.id, userId: student2.id, recordedBy: instructor.id, date: new Date('2026-06-28'), status: 'present', notes: '' },
      { classId: class1.id, userId: student2.id, recordedBy: instructor.id, date: new Date('2026-06-21'), status: 'absent', notes: 'Family trip' },
    ],
  });

  console.log('  ✅ Attendance created');

  // Tasks
  const task1 = await prisma.task.create({
    data: {
      classId: class1.id,
      title: 'Memorize Genesis 1:1',
      description: 'Memorize the first verse of Genesis and recite it in class.',
      taskType: 'memorization',
      status: 'active',
      xpReward: 30,
      pointsReward: 5,
      dueDate: new Date('2026-07-15'),
      createdBy: instructor.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      classId: class1.id,
      title: 'Draw the Creation Days',
      description: 'Draw and color each of the 7 days of creation.',
      taskType: 'activity',
      status: 'active',
      xpReward: 30,
      pointsReward: 5,
      dueDate: new Date('2026-07-20'),
      createdBy: instructor.id,
    },
  });

  // Task Submissions
  await prisma.taskSubmission.create({
    data: {
      taskId: task1.id,
      studentId: student1.id,
      content: 'In the beginning God created the heavens and the earth.',
      status: 'approved',
      xpAwarded: 30,
      pointsAwarded: 5,
    },
  });

  console.log('  ✅ Tasks & Submissions created');

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

  // Quiz Questions
  const q1 = await prisma.question.create({
    data: {
      quizId: quiz1.id,
      questionType: 'multiple_choice',
      questionText: 'How many days did God take to create everything?',
      pointsValue: 10,
      orderIndex: 1,
    },
  });

  await prisma.answer.createMany({
    data: [
      { questionId: q1.id, answerText: '5 days', isCorrect: false, orderIndex: 1 },
      { questionId: q1.id, answerText: '6 days', isCorrect: true, orderIndex: 2 },
      { questionId: q1.id, answerText: '7 days', isCorrect: false, orderIndex: 3 },
      { questionId: q1.id, answerText: '3 days', isCorrect: false, orderIndex: 4 },
    ],
  });

  const q2 = await prisma.question.create({
    data: {
      quizId: quiz1.id,
      questionType: 'true_false',
      questionText: 'God rested on the seventh day.',
      pointsValue: 10,
      orderIndex: 2,
    },
  });

  await prisma.answer.createMany({
    data: [
      { questionId: q2.id, answerText: 'True', isCorrect: true, orderIndex: 1 },
      { questionId: q2.id, answerText: 'False', isCorrect: false, orderIndex: 2 },
    ],
  });

  // Quiz Attempts
  await prisma.quizAttempt.create({
    data: {
      quizId: quiz1.id,
      studentId: student1.id,
      attemptNumber: 1,
      score: 90,
      totalPossible: 100,
      percentage: 90,
      passed: true,
      answersSnapshot: '{}',
      xpAwarded: 50,
      pointsAwarded: 10,
      startedAt: new Date('2026-06-25T09:30:00Z'),
      completedAt: new Date('2026-06-25T10:00:00Z'),
    },
  });

  console.log('  ✅ Quizzes, Questions, Answers & Attempts created');


  // Rewards
  const reward1 = await prisma.reward.create({
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

  const reward2 = await prisma.reward.create({
    data: {
      title: 'Bible Storybook',
      description: 'An illustrated Bible storybook for kids.',
      type: 'physical',
      costXp: 100,
      inventoryCount: 10,
      isActive: true,
      metadata: '{}',
    },
  });

  console.log('  ✅ Rewards created');

  // Levels
  await prisma.level.createMany({
    data: [
      { levelNumber: 1, title: 'Beginner', minXp: 0, maxXp: 499 },
      { levelNumber: 2, title: 'Explorer', minXp: 500, maxXp: 999 },
      { levelNumber: 3, title: 'Scholar', minXp: 1000, maxXp: 1999 },
      { levelNumber: 4, title: 'Champion', minXp: 2000, maxXp: 3999 },
      { levelNumber: 5, title: 'Master', minXp: 4000, maxXp: 9999 },
    ],
  });

  console.log('  ✅ Levels created');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
