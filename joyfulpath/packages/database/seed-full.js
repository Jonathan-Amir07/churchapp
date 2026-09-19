const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding robust Arabic demo database...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Levels
  const levels = [
    { levelNumber: 1, title: 'Beginner', titleAr: 'مبتدئ', minXp: 0, maxXp: 999 },
    { levelNumber: 2, title: 'Explorer', titleAr: 'مستكشف', minXp: 1000, maxXp: 2999 },
    { levelNumber: 3, title: 'Scholar', titleAr: 'عالم', minXp: 3000, maxXp: 5999 },
    { levelNumber: 4, title: 'Master', titleAr: 'متقن', minXp: 6000, maxXp: 9999 },
  ];
  for (const lvl of levels) {
    await prisma.level.upsert({
      where: { levelNumber: lvl.levelNumber },
      update: lvl,
      create: lvl,
    });
  }

  // 2. Create Users
  const usersToCreate = [
    { username: 'admin', role: 'admin', firstName: 'أدمن', lastName: 'النظام', email: 'admin@joyfulpath.com' },
    { username: 'abouna', role: 'priest', firstName: 'أبونا', lastName: 'مينا', email: 'priest@joyfulpath.com' },
    { username: 'instructor1', role: 'instructor', firstName: 'مينا', lastName: 'سمير', email: 'instructor1@joyfulpath.com' },
    { username: 'instructor2', role: 'instructor', firstName: 'مارينا', lastName: 'عادل', email: 'instructor2@joyfulpath.com' },
    { username: 'parent1', role: 'parent', firstName: 'رامي', lastName: 'كمال', email: 'parent1@joyfulpath.com', phone: '01234567890' },
    { username: 'parent2', role: 'parent', firstName: 'سامية', lastName: 'منير', email: 'parent2@joyfulpath.com', phone: '01098765432' },
  ];

  const studentsToCreate = [
    { username: 'student1', firstName: 'بيتر', lastName: 'رامي', xp: 450, pts: 100 },
    { username: 'student2', firstName: 'ماري', lastName: 'رامي', xp: 1200, pts: 300 },
    { username: 'student3', firstName: 'جون', lastName: 'أشرف', xp: 50, pts: 10 },
    { username: 'student4', firstName: 'كلارا', lastName: 'ماهر', xp: 3500, pts: 800 },
    { username: 'student5', firstName: 'فيلوباتير', lastName: 'عصام', xp: 800, pts: 200 },
  ];

  const createdUsers = {};
  
  for (const u of usersToCreate) {
    createdUsers[u.username] = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        email: u.email,
        passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        displayName: `${u.firstName} ${u.lastName}`,
        role: u.role,
        locale: 'ar',
        isProfileComplete: true,
        phone: u.phone,
      },
    });
  }

  const createdStudents = [];
  for (const s of studentsToCreate) {
    const student = await prisma.user.upsert({
      where: { username: s.username },
      update: {},
      create: {
        username: s.username,
        passwordHash,
        firstName: s.firstName,
        lastName: s.lastName,
        displayName: `${s.firstName} ${s.lastName}`,
        role: 'student',
        locale: 'ar',
        isProfileComplete: true,
        totalXp: s.xp,
        totalPoints: s.pts,
      },
    });
    createdStudents.push(student);
  }

  // 3. Create Families
  let family1 = await prisma.family.findFirst({ where: { fatherId: createdUsers['parent1'].id } });
  if (!family1) {
    family1 = await prisma.family.create({
      data: { name: 'عائلة رامي كمال', fatherId: createdUsers['parent1'].id }
    });
    await prisma.user.update({ where: { id: createdStudents[0].id }, data: { familyId: family1.id } }); // Peter
    await prisma.user.update({ where: { id: createdStudents[1].id }, data: { familyId: family1.id } }); // Mary
  }

  // 4. Create Classes
  let class1 = await prisma.class.findFirst({ where: { name: 'الصف الخامس - مارمرقس' } });
  if (!class1) {
    class1 = await prisma.class.create({
      data: {
        name: 'الصف الخامس - مارمرقس',
        academicYear: '2026',
        createdBy: createdUsers['admin'].id,
      }
    });
  }

  let class2 = await prisma.class.findFirst({ where: { name: 'الصف السادس - الأنبا بيشوي' } });
  if (!class2) {
    class2 = await prisma.class.create({
      data: {
        name: 'الصف السادس - الأنبا بيشوي',
        academicYear: '2026',
        createdBy: createdUsers['admin'].id,
      }
    });
  }

  // 5. Assign Memberships
  await prisma.classMember.upsert({
    where: { classId_userId: { classId: class1.id, userId: createdUsers['instructor1'].id } },
    update: {}, create: { classId: class1.id, userId: createdUsers['instructor1'].id, role: 'instructor' }
  });
  await prisma.classMember.upsert({
    where: { classId_userId: { classId: class2.id, userId: createdUsers['instructor2'].id } },
    update: {}, create: { classId: class2.id, userId: createdUsers['instructor2'].id, role: 'instructor' }
  });

  for (let i = 0; i < 3; i++) {
    await prisma.classMember.upsert({
      where: { classId_userId: { classId: class1.id, userId: createdStudents[i].id } },
      update: {}, create: { classId: class1.id, userId: createdStudents[i].id, role: 'student' }
    });
  }
  for (let i = 3; i < 5; i++) {
    await prisma.classMember.upsert({
      where: { classId_userId: { classId: class2.id, userId: createdStudents[i].id } },
      update: {}, create: { classId: class2.id, userId: createdStudents[i].id, role: 'student' }
    });
  }

  // 6. Lessons & Tasks
  let lesson = await prisma.lesson.findFirst({ where: { classId: class1.id } });
  if (!lesson) {
    lesson = await prisma.lesson.create({
      data: {
        classId: class1.id,
        title: 'مثل الزارع',
        content: 'درس عن مثل الزارع من إنجيل متى 13.',
        status: 'published',
        createdBy: createdUsers['instructor1'].id,
        xpReward: 100,
        pointsReward: 20
      }
    });
  }

  let task = await prisma.task.findFirst({ where: { classId: class1.id } });
  if (!task) {
    task = await prisma.task.create({
      data: {
        classId: class1.id,
        lessonId: lesson.id,
        title: 'قراءة متى 13',
        description: 'اقرأ الإصحاح ولخصه.',
        taskType: 'reading',
        status: 'published',
        createdBy: createdUsers['instructor1'].id,
      }
    });
  }

  // 7. Events
  let event = await prisma.event.findFirst({ where: { title: 'مؤتمر الكنيسة الصيفي' } });
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'مؤتمر الكنيسة الصيفي',
        description: 'مؤتمر صيفي روحي وترفيهي.',
        type: 'conference',
        date: new Date(new Date().setDate(new Date().getDate() + 10)),
        time: '09:00',
        endTime: '15:00',
        location: 'بيت المؤتمرات',
        maxCapacity: 100,
      }
    });
  }

  // 8. Rewards
  let reward = await prisma.reward.findFirst({ where: { title: 'صورة مارجرجس' } });
  if (!reward) {
    reward = await prisma.reward.create({
      data: {
        title: 'صورة مارجرجس',
        description: 'صورة جميلة لمارجرجس.',
        type: 'digital',
        costXp: 0,
        costPoints: 50,
        isActive: true,
      }
    });
  }

  // 9. Attendance
  const pastDate = new Date(new Date().setDate(new Date().getDate() - 7));
  for (let i = 0; i < 3; i++) {
    await prisma.attendance.upsert({
      where: { classId_userId_date: { classId: class1.id, userId: createdStudents[i].id, date: pastDate } },
      update: {},
      create: {
        classId: class1.id,
        userId: createdStudents[i].id,
        date: pastDate,
        status: i === 2 ? 'absent' : 'present',
        recordedBy: createdUsers['instructor1'].id
      }
    });
  }

  console.log('Robust Arabic seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
