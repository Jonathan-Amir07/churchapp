import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const demoPassword = await bcrypt.hash('demo123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'admin@joyfulpath.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'System Admin',
      passwordHash: adminPassword,
      role: 'admin',
      locale: 'ar',
      isProfileComplete: true,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create Priest
  const priest = await prisma.user.upsert({
    where: { username: 'abouna' },
    update: {},
    create: {
      email: 'abouna@joyfulpath.com',
      username: 'abouna',
      firstName: 'Abouna',
      lastName: 'Mina',
      displayName: 'Abouna Mina',
      passwordHash: demoPassword,
      role: 'priest',
      locale: 'ar',
      isProfileComplete: true,
    },
  });
  console.log(`Created priest user: ${priest.email}`);

  // 3. Create Instructor
  const instructor = await prisma.user.upsert({
    where: { username: 'instructor' },
    update: {},
    create: {
      email: 'instructor@joyfulpath.com',
      username: 'instructor',
      firstName: 'Khadem',
      lastName: 'Mikhail',
      displayName: 'Mr. Mikhail',
      passwordHash: demoPassword,
      role: 'instructor',
      locale: 'ar',
      isProfileComplete: true,
    },
  });
  console.log(`Created instructor user: ${instructor.email}`);

  // 4. Create Parent
  const parent = await prisma.user.upsert({
    where: { username: 'parent' },
    update: {},
    create: {
      email: 'parent@joyfulpath.com',
      username: 'parent',
      firstName: 'Mrs.',
      lastName: 'Mary',
      displayName: 'Mrs. Mary',
      passwordHash: demoPassword,
      role: 'parent',
      locale: 'ar',
      isProfileComplete: true,
    },
  });
  console.log(`Created parent user: ${parent.email}`);

  // 5. Create Students
  const student1 = await prisma.user.upsert({
    where: { username: 'mario' },
    update: { totalXp: 500, totalPoints: 150, currentStreak: 3 },
    create: {
      email: 'mario@joyfulpath.com',
      username: 'mario',
      firstName: 'Mario',
      lastName: 'Youssef',
      displayName: 'Mario',
      passwordHash: demoPassword,
      role: 'student',
      locale: 'ar',
      isProfileComplete: true,
      totalXp: 500,
      totalPoints: 150,
      currentStreak: 3
    },
  });

  const student2 = await prisma.user.upsert({
    where: { username: 'marina' },
    update: { totalXp: 850, totalPoints: 200, currentStreak: 5 },
    create: {
      email: 'marina@joyfulpath.com',
      username: 'marina',
      firstName: 'Marina',
      lastName: 'Youssef',
      displayName: 'Marina',
      passwordHash: demoPassword,
      role: 'student',
      locale: 'ar',
      isProfileComplete: true,
      totalXp: 850,
      totalPoints: 200,
      currentStreak: 5
    },
  });
  console.log(`Created student users: ${student1.email}, ${student2.email}`);

  // 6. Create Family (Parent -> Students)
  let family = await prisma.family.findFirst({ where: { motherId: parent.id } });
  if (!family) {
    family = await prisma.family.create({
      data: {
        name: 'Youssef Family',
        motherId: parent.id,
      }
    });
  }
  
  await prisma.user.update({ where: { id: student1.id }, data: { familyId: family.id } });
  await prisma.user.update({ where: { id: student2.id }, data: { familyId: family.id } });
  console.log(`Created family relations for Parent and Students`);

  // 7. Create Class
  let grade5Class = await prisma.class.findFirst({ where: { name: 'Grade 5 Angels' } });
  if (!grade5Class) {
    grade5Class = await prisma.class.create({
      data: {
        name: 'Grade 5 Angels',
        description: 'Sunday School class for 5th grade boys and girls',
        gradeLevel: '5',
        academicYear: '2026',
        createdBy: admin.id,
      }
    });
  }
  console.log(`Created class: ${grade5Class.name}`);

  // 8. Assign Instructor to Class
  const instructorAssignment = await prisma.classMember.findFirst({
    where: { classId: grade5Class.id, userId: instructor.id }
  });
  if (!instructorAssignment) {
    await prisma.classMember.create({
      data: {
        classId: grade5Class.id,
        userId: instructor.id,
        role: 'instructor'
      }
    });
  }

  // 9. Assign Students to Class
  const student1Assignment = await prisma.classMember.findFirst({
    where: { classId: grade5Class.id, userId: student1.id }
  });
  if (!student1Assignment) {
    await prisma.classMember.create({
      data: {
        classId: grade5Class.id,
        userId: student1.id,
        role: 'student'
      }
    });
  }

  const student2Assignment = await prisma.classMember.findFirst({
    where: { classId: grade5Class.id, userId: student2.id }
  });
  if (!student2Assignment) {
    await prisma.classMember.create({
      data: {
        classId: grade5Class.id,
        userId: student2.id,
        role: 'student'
      }
    });
  }
  console.log(`Assigned instructor and students to class`);

  // 10. Store Rewards
  const reward1 = await prisma.reward.findFirst({ where: { title: 'Coptic Cross Keychain' } });
  if (!reward1) {
    await prisma.reward.create({
      data: {
        title: 'Coptic Cross Keychain',
        description: 'A beautiful wood-carved cross',
        type: 'physical',
        costXp: 50,
        costPoints: 50,
        inventoryCount: 20,
        metadata: JSON.stringify({
          titleAr: 'ميدالية صليب قبطي',
          descriptionAr: 'صليب خشب محفور',
          icon: 'stars'
        })
      }
    });
  }

  const reward2 = await prisma.reward.findFirst({ where: { title: 'Agpeya (Book of Hours)' } });
  if (!reward2) {
    await prisma.reward.create({
      data: {
        title: 'Agpeya (Book of Hours)',
        description: 'Pocket size Agpeya',
        type: 'physical',
        costXp: 100,
        costPoints: 100,
        inventoryCount: 10,
        metadata: JSON.stringify({
          titleAr: 'الأجبية',
          descriptionAr: 'كتاب صلوات السواعي',
          icon: 'menu_book'
        })
      }
    });
  }
  console.log(`Created store rewards`);

  // 11. Redemption Request (so queue isn't empty)
  const actualReward2 = await prisma.reward.findFirst({ where: { title: 'Agpeya (Book of Hours)' } });
  if (actualReward2) {
    const existingRedemption = await prisma.rewardRedemption.findFirst({
      where: { userId: student1.id, rewardId: actualReward2.id }
    });
    if (!existingRedemption) {
      await prisma.rewardRedemption.create({
        data: {
          userId: student1.id,
          rewardId: actualReward2.id,
          status: 'pending'
        }
      });
      console.log(`Created pending redemption request for ${student1.firstName}`);
    }
  }

  // 12. Create Event
  const event = await prisma.event.findFirst({ where: { title: 'Summer Camp 2026' } });
  if (!event) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 14); // 2 weeks from now
    
    await prisma.event.create({
      data: {
        title: 'Summer Camp 2026',
        description: 'Annual summer camp for all Sunday School classes',
        type: 'camp',
        date: eventDate,
        time: '08:00',
        endTime: '18:00',
        location: 'St. Mark Retreat Center',
        maxCapacity: 100,
      }
    });
    console.log(`Created upcoming event`);
  }

  // 13. Create Lesson
  let lesson = await prisma.lesson.findFirst({ where: { title: 'The Parable of the Sower' } });
  if (!lesson) {
    lesson = await prisma.lesson.create({
      data: {
        classId: grade5Class.id,
        title: 'The Parable of the Sower',
        content: '<p>A sower went out to sow his seed...</p>',
        category: 'Parables',
        status: 'published',
        createdBy: instructor.id,
      }
    });
    console.log(`Created lesson for class`);
  }

  // 14. Create Task
  let task = await prisma.task.findFirst({ where: { title: 'Memorize Psalm 1' } });
  if (!task) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    task = await prisma.task.create({
      data: {
        classId: grade5Class.id,
        lessonId: lesson?.id,
        title: 'Memorize Psalm 1',
        description: 'Recite Psalm 1 in class or submit a voice recording.',
        taskType: 'memorization',
        dueDate: dueDate,
        status: 'published',
        createdBy: instructor.id,
      }
    });
    console.log(`Created active task`);
  }

  console.log('========================================');
  console.log('Seeding completed successfully!');
  console.log('DEMO ACCOUNTS (Password: demo123):');
  console.log('- abouna@joyfulpath.com (Priest)');
  console.log('- instructor@joyfulpath.com (Instructor)');
  console.log('- parent@joyfulpath.com (Parent)');
  console.log('- mario@joyfulpath.com (Student)');
  console.log('- marina@joyfulpath.com (Student)');
  console.log('========================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
