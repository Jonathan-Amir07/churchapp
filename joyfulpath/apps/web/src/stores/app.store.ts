import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PrayerRequest {
  id: string;
  studentName: string;
  type: 'prayer' | 'thanksgiving';
  content: string;
  isPrivate: boolean;
  isPrayedFor: boolean;
  prayedCount: number;
  response?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'digital' | 'physical';
  pointsCost: number;
  stock: number;
  icon: string;
}

export interface Redemption {
  id: string;
  userId: string;
  studentName: string;
  itemId: string;
  itemTitle: string;
  itemTitleAr: string;
  pointsCost: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  feedback?: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'daily' | 'weekly' | 'seasonal';
  target: number;
  current: number;
  xpReward: number;
  pointsReward: number;
  isCompleted: boolean;
  claimed: boolean;
}

export interface ActivityFeedItem {
  id: string;
  studentName: string;
  action: 'xp_earned' | 'task_completed' | 'badge_unlocked' | 'level_gained';
  detail: string;
  detailAr: string;
  createdAt: string;
}

export interface Task {
  id: string;
  studentName: string;
  taskTitleEn: string;
  taskTitleAr: string;
  submissionText: string;
  submittedAt: string;
  points: number;
  classId: string;
  status: 'pending' | 'approved' | 'rejected' | 'revise' | 'not_started';
}

export interface ReadingPlan {
  id: string;
  title: string;
  titleAr: string;
  chapters: { book: string; chapter: number; read: boolean }[];
  xpReward: number;
  completed: boolean;
}

export interface MemorizedVerse {
  id: string;
  reference: string;
  text: string;
  textAr: string;
  progress: number; // 0 to 100
  isMastered: boolean;
}

export interface Question {
  id: string;
  textEn: string;
  textAr: string;
  optionsEn: string[];
  optionsAr: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  passingScore: number;
  xp: number;
  points: number;
  classId?: string;
  status: 'passed' | 'failed' | 'not-started';
  questions: Question[];
}

interface AppState {
  // Student statistics
  xp: number;
  points: number;
  level: number;
  streak: number;
  longestStreak: number;
  
  // Store limits
  monthlyRedemptionsCount: number;
  lastRedemptionMonth: string;
  
  // Lists
  prayers: PrayerRequest[];
  rewards: RewardItem[];
  redemptions: Redemption[];
  challenges: Challenge[];
  activities: ActivityFeedItem[];
  readingPlans: ReadingPlan[];
  memorizedVerses: MemorizedVerse[];
  tasks: Task[];
  quizzes: Quiz[];
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'status' | 'submittedAt' | 'submissionText' | 'studentName'>) => void;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'status'>) => void;
  addXP: (amount: number) => void;
  addPoints: (amount: number) => void;
  addPrayer: (type: 'prayer' | 'thanksgiving', content: string, isPrivate: boolean, studentName: string) => void;
  amenPrayer: (id: string) => void;
  respondPrayer: (id: string, response: string) => void;
  markPrayedFor: (id: string) => void;
  redeemReward: (itemId: string, studentName: string) => boolean;
  processRedemption: (id: string, status: 'approved' | 'rejected', feedback?: string) => void;
  addRewardItem: (item: Omit<RewardItem, 'id'>) => void;
  incrementChallenge: (type: 'daily' | 'weekly' | 'seasonal', amount: number) => void;
  claimChallengeReward: (id: string) => void;
  addActivity: (studentName: string, action: ActivityFeedItem['action'], detail: string, detailAr: string) => void;
  toggleChapterRead: (planId: string, book: string, chapter: number) => void;
  updateVerseProgress: (id: string, progress: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      xp: 450,
      points: 80,
      level: 3,
      streak: 5,
      longestStreak: 12,
      
      monthlyRedemptionsCount: 0,
      lastRedemptionMonth: '',
      
      prayers: [
        {
          id: 'p1',
          studentName: 'Jonathan',
          type: 'thanksgiving',
          content: 'Thank God for passing my school exams with high grades!',
          isPrivate: false,
          isPrayedFor: false,
          prayedCount: 3,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'p2',
          studentName: 'Mary',
          type: 'prayer',
          content: 'Please pray for my grandmother who is currently sick in the hospital.',
          isPrivate: false,
          isPrayedFor: true,
          prayedCount: 8,
          response: 'May God heal her and comfort your family.',
          respondedAt: new Date().toISOString(),
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
        {
          id: 'p3',
          studentName: 'Andrew',
          type: 'prayer',
          content: 'I need prayers to help me memorize the Gospel verses better.',
          isPrivate: true,
          isPrayedFor: false,
          prayedCount: 0,
          createdAt: new Date().toISOString(),
        }
      ],
      
      tasks: [
        {
          id: 't1',
          studentName: 'Jonathan',
          taskTitleEn: 'Memorize Genesis 1:1 Verse',
          taskTitleAr: 'تسميع آية تكوين ١:١',
          submissionText: '',
          submittedAt: '',
          points: 30,
          classId: 'c1',
          status: 'not_started',
        },
        {
          id: 't2',
          studentName: 'Jonathan',
          taskTitleEn: 'Draw the Creation Days Activity',
          taskTitleAr: 'نشاط رسم أيام الخليقة',
          submissionText: '',
          submittedAt: '',
          points: 30,
          classId: 'c1',
          status: 'not_started',
        },
        {
          id: 't3',
          studentName: 'Jonathan',
          taskTitleEn: "Color Noah's Ark Illustration",
          taskTitleAr: 'تلوين رسمة فلك نوح',
          submissionText: '',
          submittedAt: '',
          points: 30,
          classId: 'c1',
          status: 'not_started',
        },
      ],
      
      quizzes: [
        {
          id: '1',
          titleEn: 'The Story of Creation Quiz',
          titleAr: 'اختبار قصة الخلق',
          descriptionEn: 'Test your knowledge on the six days of creation.',
          descriptionAr: 'اختبر معلوماتك حول الأيام الستة للخليقة.',
          passingScore: 70,
          xp: 50,
          points: 10,
          status: 'passed',
          questions: [
            {
              id: 'q1',
              textEn: 'What did God create on the first day?',
              textAr: 'ماذا خلق الله في اليوم الأول؟',
              optionsEn: ['Light', 'Sun & Moon', 'Plants', 'Animals'],
              optionsAr: ['النور', 'الشمس والقمر', 'النباتات', 'الحيوانات'],
              correctIndex: 0,
            },
            {
              id: 'q2',
              textEn: 'On which day did God rest?',
              textAr: 'في أي يوم استراح الله؟',
              optionsEn: ['Day 5', 'Day 6', 'Day 7', 'Day 1'],
              optionsAr: ['اليوم الخامس', 'اليوم السادس', 'اليوم السابع', 'اليوم الأول'],
              correctIndex: 2,
            },
          ],
        },
        {
          id: '2',
          titleEn: "Noah's Ark & Rainbow Covenant",
          titleAr: 'فلك نوح وعهد قوس قزح',
          descriptionEn: 'Find out how much you know about Noah, the Ark, and God\'s promise.',
          descriptionAr: 'اكتشف مدى معرفتك بنوح والفلك ووعد الله.',
          passingScore: 70,
          xp: 50,
          points: 10,
          status: 'not-started',
          questions: [
            {
              id: 'q3',
              textEn: 'How many days and nights did it rain during the great flood?',
              textAr: 'كم يوماً وليلة استمر المطر خلال الطوفان العظيم؟',
              optionsEn: ['7 days', '40 days', '10 days', '100 days'],
              optionsAr: ['٧ أيام', '٤٠ يوماً', '١٠ أيام', '١٠٠ يوم'],
              correctIndex: 1,
            },
            {
              id: 'q4',
              textEn: 'What sign did God put in the sky as a covenant promise?',
              textAr: 'ما هي العلامة التي وضعها الله في السماء كعهد ووعد؟',
              optionsEn: ['Rainbow', 'Bright Star', 'Eclipse', 'Lightning'],
              optionsAr: ['قوس قزح', 'نجم ساطع', 'خسوف', 'برق'],
              correctIndex: 0,
            },
          ],
        },
      ],
      
      rewards: [
        {
          id: 'r1',
          title: 'Honorary Wisdom Seeker Title',
          titleAr: 'لقب باحث الحكمة الفخري',
          description: 'A glowing title badge for your student profile page.',
          descriptionAr: 'لقب لامع يظهر في صفحة ملفك الشخصي.',
          type: 'digital',
          pointsCost: 30,
          stock: 9999,
          icon: 'workspace_premium',
        },
        {
          id: 'r2',
          title: 'Neon Sparks Avatar Frame',
          titleAr: 'إطار الصورة الرمزية الشرر النيون',
          description: 'A dynamic glowing border overlay for your profile picture.',
          descriptionAr: 'حد متوهج ديناميكي يحيط بصورتك الشخصية.',
          type: 'digital',
          pointsCost: 50,
          stock: 9999,
          icon: 'face',
        },
        {
          id: 'r3',
          title: 'Illustrated Bible Storybook',
          titleAr: 'قصص الكتاب المقدس المصورة',
          description: 'A beautiful hardcover book containing old & new testament tales.',
          descriptionAr: 'كتاب مجلد فاخر يحتوي على قصص العهد القديم والجديد.',
          type: 'physical',
          pointsCost: 100,
          stock: 12,
          icon: 'book',
        },
        {
          id: 'r4',
          title: 'JoyfulPath Stationery Set',
          titleAr: 'مجموعة أدوات مكتبية بهجة المسار',
          description: 'Includes a customized notebook, pen, and bookmark ribbon.',
          descriptionAr: 'تتضمن دفتر ملاحظات مخصص، قلم، وشريط فاصل للكتب.',
          type: 'physical',
          pointsCost: 60,
          stock: 25,
          icon: 'edit_note',
        }
      ],
      
      redemptions: [
        {
          id: 'red1',
          userId: 'u1',
          studentName: 'Jonathan',
          itemId: 'r3',
          itemTitle: 'Illustrated Bible Storybook',
          itemTitleAr: 'قصص الكتاب المقدس المصورة',
          pointsCost: 100,
          status: 'approved',
          feedback: 'Enjoy your new storybook!',
          createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        },
        {
          id: 'red2',
          userId: 'u1',
          studentName: 'Jonathan',
          itemId: 'r1',
          itemTitle: 'Honorary Wisdom Seeker Title',
          itemTitleAr: 'لقب باحث الحكمة الفخري',
          pointsCost: 30,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      ],
      
      challenges: [
        {
          id: 'c1',
          title: 'Quiz Champion',
          titleAr: 'بطل الاختبارات',
          description: 'Answer 2 quizzes successfully.',
          descriptionAr: 'أجب عن اختبارين بنجاح.',
          type: 'daily',
          target: 2,
          current: 1,
          xpReward: 40,
          pointsReward: 10,
          isCompleted: false,
          claimed: false,
        },
        {
          id: 'c2',
          title: 'Scripture Devoted',
          titleAr: 'مكرس للكتاب',
          description: 'Mark 5 chapters of reading plan as read.',
          descriptionAr: 'قم بوضع علامة قراءة على 5 أصحاحات.',
          type: 'weekly',
          target: 5,
          current: 3,
          xpReward: 100,
          pointsReward: 20,
          isCompleted: false,
          claimed: false,
        },
        {
          id: 'c3',
          title: 'Summer Bible Explorer',
          titleAr: 'مستكشف الإنجيل الصيفي',
          description: 'Complete 10 tasks or quizzes this season.',
          descriptionAr: 'أكمل 10 مهام أو اختبارات هذا الموسم.',
          type: 'seasonal',
          target: 10,
          current: 7,
          xpReward: 300,
          pointsReward: 50,
          isCompleted: false,
          claimed: false,
        }
      ],
      
      activities: [
        {
          id: 'a1',
          studentName: 'Jonathan',
          action: 'xp_earned',
          detail: 'Earned +50 XP from Lesson 1 review.',
          detailAr: 'ربح +50 نقطة خبرة من مراجعة الدرس الأول.',
          createdAt: new Date(Date.now() - 600000).toISOString(),
        },
        {
          id: 'a2',
          studentName: 'Mary',
          action: 'badge_unlocked',
          detail: 'Unlocked "Attendance Hero" badge!',
          detailAr: 'فتح وسام "بطل الحضور"!',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'a3',
          studentName: 'Andrew',
          action: 'level_gained',
          detail: 'Reached Level 4 (Bible Buddy)!',
          detailAr: 'وصل إلى المستوى الرابع (صديق الكتاب)!',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'a4',
          studentName: 'Jonathan',
          action: 'task_completed',
          detail: 'Completed "Memorize John 3:16" assignment.',
          detailAr: 'أكمل مهمة حفظ آية "يوحنا 3: 16".',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
        }
      ],

      readingPlans: [
        {
          id: 'plan1',
          title: 'Gospel of Mark - Week 1',
          titleAr: 'إنجيل مرقس - الأسبوع الأول',
          chapters: [
            { book: 'Mark', chapter: 1, read: true },
            { book: 'Mark', chapter: 2, read: true },
            { book: 'Mark', chapter: 3, read: false },
            { book: 'Mark', chapter: 4, read: false },
            { book: 'Mark', chapter: 5, read: false },
          ],
          xpReward: 50,
          completed: false,
        },
        {
          id: 'plan2',
          title: 'Genesis Patriarchs',
          titleAr: 'آباء سفر التكوين',
          chapters: [
            { book: 'Genesis', chapter: 12, read: true },
            { book: 'Genesis', chapter: 13, read: false },
            { book: 'Genesis', chapter: 14, read: false },
          ],
          xpReward: 40,
          completed: false,
        }
      ],

      memorizedVerses: [
        {
          id: 'v1',
          reference: 'John 3:16',
          text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
          textAr: 'لأَنَّهُ هكَذَا أَحَبَّ اللهُ الْعَالَمَ حَتَّى بَذَلَ ابْنَهُ الْوَحِيدَ، لِكَيْ لاَ يَهْلِكَ كُلُّ مَنْ يُؤْمِنُ بِهِ، بَلْ تَكُونُ لَهُ الْحَيَاةُ الأَبَدِيَّةُ.',
          progress: 80,
          isMastered: false,
        },
        {
          id: 'v2',
          reference: 'Psalm 23:1',
          text: 'The Lord is my shepherd; I shall not want.',
          textAr: 'الرَّبُّ رَاعِيَّ فَلاَ يُعْوِزُنِي شَيْءٌ.',
          progress: 100,
          isMastered: true,
        },
        {
          id: 'v3',
          reference: 'Joshua 1:9',
          text: 'Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.',
          textAr: 'تَقَوَّ وَتَشَجَّعْ! لاَ تَرْهَبْ وَلاَ تَرْتَعِبْ لأَنَّ الرَّبَّ إِلهَكَ مَعَكَ حَيْثُمَا تَذْهَبُ.',
          progress: 30,
          isMastered: false,
        }
      ],
      
      addXP: (amount) => {
        set((state) => {
          const newXp = state.xp + amount;
          // Easy level calculation check (every 300 XP is a level)
          const newLevel = Math.floor(newXp / 300) + 1;
          const levelUp = newLevel > state.level;
          
          return {
            xp: newXp,
            level: newLevel,
            activities: levelUp ? [
              {
                id: Math.random().toString(),
                studentName: 'Jonathan',
                action: 'level_gained',
                detail: `Reached Level ${newLevel}!`,
                detailAr: `وصل إلى المستوى ${newLevel}!`,
                createdAt: new Date().toISOString(),
              },
              ...state.activities
            ] : state.activities
          };
        });
      },
      
      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      
      addPrayer: (type, content, isPrivate, studentName) => set((state) => ({
        prayers: [
          {
            id: Math.random().toString(),
            studentName,
            type,
            content,
            isPrivate,
            isPrayedFor: false,
            prayedCount: 0,
            createdAt: new Date().toISOString(),
          },
          ...state.prayers
        ]
      })),
      
      amenPrayer: (id) => set((state) => ({
        prayers: state.prayers.map((p) => 
          p.id === id ? { ...p, prayedCount: p.prayedCount + 1 } : p
        )
      })),
      
      respondPrayer: (id, response) => set((state) => ({
        prayers: state.prayers.map((p) => 
          p.id === id ? { ...p, response, respondedAt: new Date().toISOString(), isPrayedFor: true } : p
        )
      })),
      
      markPrayedFor: (id) => set((state) => ({
        prayers: state.prayers.map((p) => 
          p.id === id ? { ...p, isPrayedFor: true } : p
        )
      })),
      
      addTask: (task) => set((state) => ({
        tasks: [
          {
            ...task,
            id: Math.random().toString(),
            studentName: '',
            status: 'not_started',
            submissionText: '',
            submittedAt: '',
          },
          ...state.tasks
        ]
      })),
      
      addQuiz: (quiz) => set((state) => ({
        quizzes: [
          {
            ...quiz,
            id: Math.random().toString(),
            status: 'not-started',
            questions: quiz.questions && quiz.questions.length > 0 ? quiz.questions : [
              {
                id: Math.random().toString(),
                textEn: `Quiz Question on ${quiz.titleEn}`,
                textAr: `سؤال حول ${quiz.titleAr}`,
                optionsEn: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                optionsAr: ['الخيار ١', 'الخيار ٢', 'الخيار ٣', 'الخيار ٤'],
                correctIndex: 0,
              }
            ]
          },
          ...state.quizzes
        ]
      })),
      
      redeemReward: (itemId, studentName) => {
        let success = false;
        set((state) => {
          const item = state.rewards.find((r) => r.id === itemId);
          if (!item) return state;
          if (state.points < item.pointsCost) return state;
          if (item.type === 'physical' && item.stock <= 0) return state;
          
          const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
          let currentCount = state.monthlyRedemptionsCount;
          
          if (state.lastRedemptionMonth !== currentMonth) {
            currentCount = 0;
          }
          
          if (currentCount >= 2) return state;
          
          success = true;
          const updatedRewards = state.rewards.map((r) => 
            r.id === itemId && r.type === 'physical' ? { ...r, stock: r.stock - 1 } : r
          );
          
          const newRedemption: Redemption = {
            id: Math.random().toString(),
            userId: 'u1',
            studentName,
            itemId,
            itemTitle: item.title,
            itemTitleAr: item.titleAr,
            pointsCost: item.pointsCost,
            status: item.type === 'digital' ? 'approved' : 'pending',
            createdAt: new Date().toISOString(),
          };
          
          return {
            points: state.points - item.pointsCost,
            rewards: updatedRewards,
            redemptions: [newRedemption, ...state.redemptions],
            activities: [
              {
                id: Math.random().toString(),
                studentName,
                action: 'xp_earned', // Generic action type
                detail: `Redeemed reward: ${item.title}`,
                detailAr: `استبدل المكافأة: ${item.titleAr}`,
                createdAt: new Date().toISOString(),
              },
              ...state.activities
            ],
            monthlyRedemptionsCount: currentCount + 1,
            lastRedemptionMonth: currentMonth
          };
        });
        return success;
      },
      
      processRedemption: (id, status, feedback) => set((state) => ({
        redemptions: state.redemptions.map((red) => 
          red.id === id ? { ...red, status, feedback, approvedAt: new Date().toISOString() } : red
        )
      })),
      
      addRewardItem: (item) => set((state) => ({
        rewards: [
          ...state.rewards,
          {
            ...item,
            id: Math.random().toString(),
          }
        ]
      })),
      
      incrementChallenge: (type, amount) => set((state) => {
        const updated = state.challenges.map((c) => {
          if (c.type === type && !c.isCompleted) {
            const current = Math.min(c.target, c.current + amount);
            const isCompleted = current >= c.target;
            return { ...c, current, isCompleted };
          }
          return c;
        });
        return { challenges: updated };
      }),
      
      claimChallengeReward: (id) => set((state) => {
        const c = state.challenges.find((ch) => ch.id === id);
        if (!c || !c.isCompleted || c.claimed) return state;
        
        // Add rewards and mark claimed
        const updatedChallenges = state.challenges.map((ch) => 
          ch.id === id ? { ...ch, claimed: true } : ch
        );
        
        // Let's add XP & points
        setTimeout(() => {
          get().addXP(c.xpReward);
          get().addPoints(c.pointsReward);
        }, 10);
        
        return {
          challenges: updatedChallenges,
          activities: [
            {
              id: Math.random().toString(),
              studentName: 'Jonathan',
              action: 'xp_earned',
              detail: `Completed challenge: ${c.title}! (+${c.xpReward} XP, +${c.pointsReward} pts)`,
              detailAr: `أكمل التحدي: ${c.titleAr}! (+${c.xpReward} خبرة، +${c.pointsReward} نقطة)`,
              createdAt: new Date().toISOString(),
            },
            ...state.activities
          ]
        };
      }),
      
      addActivity: (studentName, action, detail, detailAr) => set((state) => ({
        activities: [
          {
            id: Math.random().toString(),
            studentName,
            action,
            detail,
            detailAr,
            createdAt: new Date().toISOString(),
          },
          ...state.activities
        ]
      })),

      toggleChapterRead: (planId, book, chapter) => set((state) => {
        const plans = state.readingPlans.map((plan) => {
          if (plan.id === planId) {
            const chapters = plan.chapters.map((ch) => 
              ch.book === book && ch.chapter === chapter ? { ...ch, read: !ch.read } : ch
            );
            const completedCount = chapters.filter((c) => c.read).length;
            const completed = completedCount === chapters.length;
            
            // Check challenge increment for reading weeklies
            // Only increment if checking a chapter as read
            const isReadNow = chapters.find((ch) => ch.book === book && ch.chapter === chapter)?.read;
            if (isReadNow) {
              setTimeout(() => {
                get().incrementChallenge('weekly', 1);
              }, 10);
            }
            
            return { ...plan, chapters, completed };
          }
          return plan;
        });
        return { readingPlans: plans };
      }),

      updateVerseProgress: (id, progress) => set((state) => {
        const verses = state.memorizedVerses.map((v) => {
          if (v.id === id) {
            const isMastered = progress === 100;
            return { ...v, progress, isMastered };
          }
          return v;
        });
        return { memorizedVerses: verses };
      })
    }),
    {
      name: 'joyfulpath-app-storage',
    }
  )
);
