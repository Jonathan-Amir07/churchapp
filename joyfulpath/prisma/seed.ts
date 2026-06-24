import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Levels
  const levels = [
    { levelNumber: 1, title: 'Seedling', titleAr: 'بذرة صغيرة', minXp: 0, maxXp: 100, color: '#4ADE80' },
    { levelNumber: 2, title: 'Little Lamb', titleAr: 'حمل صغير', minXp: 100, maxXp: 250, color: '#34D399' },
    { levelNumber: 3, title: 'Bright Light', titleAr: 'نور ساطع', minXp: 250, maxXp: 500, color: '#60A5FA' },
    { levelNumber: 4, title: 'Bible Buddy', titleAr: 'صديق الكتاب', minXp: 500, maxXp: 800, color: '#3B82F6' },
    { levelNumber: 5, title: 'Story Keeper', titleAr: 'حافظ القصص', minXp: 800, maxXp: 1200, color: '#818CF8' },
    { levelNumber: 6, title: 'Verse Master', titleAr: 'بارع الآيات', minXp: 1200, maxXp: 1700, color: '#6366F1' },
    { levelNumber: 7, title: 'Faith Seeker', titleAr: 'باحث الإيمان', minXp: 1700, maxXp: 2300, color: '#A78BFA' },
    { levelNumber: 8, title: 'Prayer Hero', titleAr: 'بطل الصلاة', minXp: 2300, maxXp: 3000, color: '#8B5CF6' },
    { levelNumber: 9, title: 'Wisdom Scout', titleAr: 'مستكشف الحكمة', minXp: 3000, maxXp: 4000, color: '#F472B6' },
    { levelNumber: 10, title: 'Young Explorer', titleAr: 'مستكشف صغير', minXp: 4000, maxXp: 5200, color: '#EC4899' },
    { levelNumber: 11, title: 'Faith Warrior', titleAr: 'محارب الإيمان', minXp: 5200, maxXp: 6800, color: '#FBBF24' },
    { levelNumber: 12, title: 'Master Disciple', titleAr: 'تلميذ متمكن', minXp: 6800, maxXp: 9000, color: '#F59E0B' },
    { levelNumber: 13, title: 'Champion of Light', titleAr: 'بطل النور', minXp: 9000, maxXp: 12000, color: '#FB7185' },
    { levelNumber: 14, title: 'Kingdom Builder', titleAr: 'باني الملكوت', minXp: 12000, maxXp: 16000, color: '#F43F5E' },
    { levelNumber: 15, title: 'Heavenly Star', titleAr: 'نجم سمائي', minXp: 16000, maxXp: 999999, color: '#EF4444' },
  ];

  for (const level of levels) {
    await prisma.level.upsert({
      where: { levelNumber: level.levelNumber },
      update: {
        title: level.title,
        titleAr: level.titleAr,
        minXp: level.minXp,
        maxXp: level.maxXp,
        color: level.color,
      },
      create: {
        levelNumber: level.levelNumber,
        title: level.title,
        titleAr: level.titleAr,
        minXp: level.minXp,
        maxXp: level.maxXp,
        color: level.color,
      },
    });
  }
  console.log(`Upserted ${levels.length} levels.`);

  // 2. Seed Badges
  const badges = [
    {
      name: 'Attendance Starter',
      nameAr: 'بداية الحضور',
      description: 'Attend your first Sunday School class',
      descriptionAr: 'احضر أول فصل في مدارس الأحد',
      iconUrl: '/badges/attendance-starter.png',
      category: 'attendance',
      criteriaType: 'count',
      criteriaValue: 1,
      criteriaConfig: {},
      xpBonus: 50,
      pointsBonus: 10,
      rarity: 'common',
    },
    {
      name: 'Faithful Attender',
      nameAr: 'المواظب الأمين',
      description: 'Attend Sunday School 10 times',
      descriptionAr: 'احضر مدارس الأحد 10 مرات',
      iconUrl: '/badges/faithful-attender.png',
      category: 'attendance',
      criteriaType: 'count',
      criteriaValue: 10,
      criteriaConfig: {},
      xpBonus: 150,
      pointsBonus: 30,
      rarity: 'uncommon',
    },
    {
      name: 'Bible Scholar',
      nameAr: 'باحث الكتاب المقدس',
      description: 'Score 100% on 5 quizzes',
      descriptionAr: 'احصل على 100% في 5 اختبارات',
      iconUrl: '/badges/bible-scholar.png',
      category: 'quiz',
      criteriaType: 'count',
      criteriaValue: 5,
      criteriaConfig: {},
      xpBonus: 200,
      pointsBonus: 40,
      rarity: 'rare',
    },
    {
      name: 'First Step',
      nameAr: 'الخطوة الأولى',
      description: 'Complete your first lesson',
      descriptionAr: 'أكمل درسك الأول',
      iconUrl: '/badges/first-step.png',
      category: 'lesson',
      criteriaType: 'count',
      criteriaValue: 1,
      criteriaConfig: {},
      xpBonus: 50,
      pointsBonus: 10,
      rarity: 'common',
    },
    {
      name: 'Streak Builder',
      nameAr: 'صاحب الحماس المستمر',
      description: 'Maintain a 5-day login/activity streak',
      descriptionAr: 'حافظ على سلسلة نشاط متتالية لمدة 5 أيام',
      iconUrl: '/badges/streak-builder.png',
      category: 'streak',
      criteriaType: 'streak',
      criteriaValue: 5,
      criteriaConfig: {},
      xpBonus: 100,
      pointsBonus: 20,
      rarity: 'uncommon',
    },
    {
      name: 'Kingdom Hero',
      nameAr: 'بطل الملكوت',
      description: 'Awarded manually by your servant for outstanding behavior',
      descriptionAr: 'يمنحها الخادم يدويًا للسلوك المتميز',
      iconUrl: '/badges/kingdom-hero.png',
      category: 'special',
      criteriaType: 'manual',
      criteriaValue: null,
      criteriaConfig: {},
      xpBonus: 500,
      pointsBonus: 100,
      rarity: 'legendary',
    },
  ];

  for (const badge of badges) {
    const existing = await prisma.badge.findFirst({
      where: { name: badge.name },
    });

    if (existing) {
      await prisma.badge.update({
        where: { id: existing.id },
        data: badge as any,
      });
    } else {
      await prisma.badge.create({
        data: badge as any,
      });
    }
  }
  console.log(`Upserted ${badges.length} badges.`);

  // 3. Seed Bootstrap Users
  console.log('Seeding bootstrap users...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const servantPasswordHash = await bcrypt.hash('servant123', 10);
  const studentPinHash = await bcrypt.hash('1234', 10);

  // Admin
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@joyfulpath.org' },
  });
  if (!adminUser) {
    await prisma.user.create({
      data: {
        email: 'admin@joyfulpath.org',
        passwordHash: adminPasswordHash,
        firstName: 'System',
        lastName: 'Admin',
        displayName: 'System Admin',
        role: 'admin',
        locale: 'en',
      },
    });
  }

  // Instructor
  const servantUser = await prisma.user.findFirst({
    where: { email: 'servant@joyfulpath.org' },
  });
  if (!servantUser) {
    await prisma.user.create({
      data: {
        email: 'servant@joyfulpath.org',
        passwordHash: servantPasswordHash,
        firstName: 'Class',
        lastName: 'Servant',
        displayName: 'Class Servant',
        role: 'instructor',
        locale: 'en',
      },
    });
  }

  // Student
  const studentUser = await prisma.user.findFirst({
    where: { username: 'explorer' },
  });
  if (!studentUser) {
    await prisma.user.create({
      data: {
        username: 'explorer',
        passwordHash: '', // Unused for student
        pinHash: studentPinHash,
        firstName: 'Young',
        lastName: 'Explorer',
        displayName: 'Young Explorer',
        role: 'student',
        locale: 'en',
        totalXp: 0,
        totalPoints: 0,
      },
    });
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
