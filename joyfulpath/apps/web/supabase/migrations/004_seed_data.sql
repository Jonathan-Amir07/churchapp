-- Sunday School Platform Database Migration
-- 004_seed_data.sql

-- Seeding Levels
insert into levels (level_number, title, title_ar, min_xp, max_xp, color) values
  (1, 'Seedling', 'بذرة صغيرة', 0, 100, '#4ADE80'),
  (2, 'Little Lamb', 'حمل صغير', 100, 250, '#34D399'),
  (3, 'Bright Light', 'نور ساطع', 250, 500, '#60A5FA'),
  (4, 'Bible Buddy', 'صديق الكتاب', 500, 800, '#3B82F6'),
  (5, 'Story Keeper', 'حافظ القصص', 800, 1200, '#818CF8'),
  (6, 'Verse Master', 'بارع الآيات', 1200, 1700, '#6366F1'),
  (7, 'Faith Seeker', 'باحث الإيمان', 1700, 2300, '#A78BFA'),
  (8, 'Prayer Hero', 'بطل الصلاة', 2300, 3000, '#8B5CF6'),
  (9, 'Wisdom Scout', 'مستكشف الحكمة', 3000, 4000, '#F472B6'),
  (10, 'Young Explorer', 'مستكشف صغير', 4000, 5200, '#EC4899'),
  (11, 'Faith Warrior', 'محارب الإيمان', 5200, 6800, '#FBBF24'),
  (12, 'Master Disciple', 'تلميذ متمكن', 6800, 9000, '#F59E0B'),
  (13, 'Champion of Light', 'بطل النور', 9000, 12000, '#FB7185'),
  (14, 'Kingdom Builder', 'باني الملكوت', 12000, 16000, '#F43F5E'),
  (15, 'Heavenly Star', 'نجم سمائي', 16000, 999999, '#EF4444')
on conflict (level_number) do update set
  title = excluded.title,
  title_ar = excluded.title_ar,
  min_xp = excluded.min_xp,
  max_xp = excluded.max_xp,
  color = excluded.color;

-- Seeding Default Badges
insert into badges (name, name_ar, description, description_ar, icon_url, category, criteria_type, criteria_value, xp_bonus, points_bonus, rarity) values
  ('Attendance Starter', 'بداية الحضور', 'Attend your first Sunday School class', 'احضر أول فصل في مدارس الأحد', '/badges/attendance-starter.png', 'attendance', 'count', 1, 50, 10, 'common'),
  ('Faithful Attender', 'المواظب الأمين', 'Attend Sunday School 10 times', 'احضر مدارس الأحد 10 مرات', '/badges/faithful-attender.png', 'attendance', 'count', 10, 150, 30, 'uncommon'),
  ('Bible Scholar', 'باحث الكتاب المقدس', 'Score 100% on 5 quizzes', 'احصل على 100% في 5 اختبارات', '/badges/bible-scholar.png', 'quiz', 'count', 5, 200, 40, 'rare'),
  ('First Step', 'الخطوة الأولى', 'Complete your first lesson', 'أكمل درسك الأول', '/badges/first-step.png', 'lesson', 'count', 1, 50, 10, 'common'),
  ('Streak Builder', 'صاحب الحماس المستمر', 'Maintain a 5-day login/activity streak', 'حافظ على سلسلة نشاط متتالية لمدة 5 أيام', '/badges/streak-builder.png', 'streak', 'streak', 5, 100, 20, 'uncommon'),
  ('Kingdom Hero', 'بطل الملكوت', 'Awarded manually by your servant for outstanding behavior', 'يمنحها الخادم يدويًا للسلوك المتميز', '/badges/kingdom-hero.png', 'special', 'manual', null, 500, 100, 'legendary')
on conflict do nothing;
