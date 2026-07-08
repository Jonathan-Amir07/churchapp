// Mock Supabase client for offline testing (no real database required)
// src/lib/supabase/mockClient.ts

export const isMockMode = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL;

// ─── Cookie helpers ──────────────────────────────────────────────────────────

export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

export function setCookie(name: string, val: string) {
  if (typeof document !== 'undefined')
    document.cookie = `${name}=${val}; path=/; max-age=31536000`;
}

export function deleteCookie(name: string) {
  if (typeof document !== 'undefined')
    document.cookie = `${name}=; path=/; max-age=0`;
}

// ─── Mock users & profiles ───────────────────────────────────────────────────

export function getMockUser(role: string) {
  return {
    id: `mock-${role}-id`,
    email: `${role}@joyfulpath.org`,
    app_metadata: { role },
    user_metadata: { role },
  };
}

const MOCK_PROFILES: Record<string, any> = {
  'mock-student-id': {
    id: 'mock-student-id',
    email: 'student@joyfulpath.org',
    username: 'student123',
    first_name: 'Jonathan',
    last_name: 'Junior',
    display_name: 'Jonathan Junior',
    avatar_url: null,
    role: 'student',
    locale: 'en',
    total_xp: 1250,
    total_points: 120,
    current_streak: 5,
    longest_streak: 10,
    active_title: null,
    active_avatar_frame: null,
    active_profile_theme: null,
  },
  'mock-student2-id': {
    id: 'mock-student2-id',
    email: 'student2@joyfulpath.org',
    username: 'student456',
    first_name: 'Mary',
    last_name: 'Grace',
    display_name: 'Mary Grace',
    avatar_url: null,
    role: 'student',
    locale: 'en',
    total_xp: 780,
    total_points: 65,
    current_streak: 2,
    longest_streak: 7,
    active_title: null,
    active_avatar_frame: null,
    active_profile_theme: null,
  },
  'mock-parent-id': {
    id: 'mock-parent-id',
    email: 'parent@joyfulpath.org',
    username: 'parent123',
    first_name: 'Samuel',
    last_name: 'Amir',
    display_name: 'Samuel Amir',
    avatar_url: null,
    role: 'parent',
    locale: 'en',
    total_xp: 0,
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    active_title: null,
    active_avatar_frame: null,
    active_profile_theme: null,
  },
  'mock-instructor-id': {
    id: 'mock-instructor-id',
    email: 'instructor@joyfulpath.org',
    username: 'instructor123',
    first_name: 'Peter',
    last_name: 'Mark',
    display_name: 'Peter Mark',
    avatar_url: null,
    role: 'instructor',
    locale: 'en',
    total_xp: 0,
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    active_title: null,
    active_avatar_frame: null,
    active_profile_theme: null,
  },
  'mock-admin-id': {
    id: 'mock-admin-id',
    email: 'admin@joyfulpath.org',
    username: 'admin123',
    first_name: 'George',
    last_name: 'Bishop',
    display_name: 'George Bishop',
    avatar_url: null,
    role: 'admin',
    locale: 'en',
    total_xp: 0,
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    active_title: null,
    active_avatar_frame: null,
    active_profile_theme: null,
  },
};

export function getMockProfile(role: string) {
  return MOCK_PROFILES[`mock-${role}-id`] ?? MOCK_PROFILES['mock-student-id'];
}

// ─── Mock table data ─────────────────────────────────────────────────────────

const MOCK_PARENT_CHILDREN = [
  { id: 'link-1', parent_id: 'mock-parent-id', student_id: 'mock-student-id' },
  { id: 'link-2', parent_id: 'mock-parent-id', student_id: 'mock-student2-id' },
];

const MOCK_ATTENDANCE = [
  { id: 'a1', user_id: 'mock-student-id',  date: '2026-06-28', status: 'present', notes: 'Excellent participation' },
  { id: 'a2', user_id: 'mock-student-id',  date: '2026-06-21', status: 'present', notes: '' },
  { id: 'a3', user_id: 'mock-student-id',  date: '2026-06-14', status: 'late',    notes: 'Late by 10 mins' },
  { id: 'a4', user_id: 'mock-student-id',  date: '2026-06-07', status: 'absent',  notes: 'Sick' },
  { id: 'a5', user_id: 'mock-student-id',  date: '2026-05-31', status: 'present', notes: '' },
  { id: 'a6', user_id: 'mock-student-id',  date: '2026-05-24', status: 'present', notes: 'Led the prayer' },
  { id: 'b1', user_id: 'mock-student2-id', date: '2026-06-28', status: 'present', notes: '' },
  { id: 'b2', user_id: 'mock-student2-id', date: '2026-06-21', status: 'absent',  notes: 'Family trip' },
  { id: 'b3', user_id: 'mock-student2-id', date: '2026-06-14', status: 'present', notes: '' },
  { id: 'b4', user_id: 'mock-student2-id', date: '2026-06-07', status: 'present', notes: 'Great quiz score' },
];

const MOCK_LESSON_PROGRESS = [
  { id: 'lp1', user_id: 'mock-student-id',  progress_pct: 100, lessons: { title: 'Genesis — The Creation Story' } },
  { id: 'lp2', user_id: 'mock-student-id',  progress_pct: 60,  lessons: { title: 'Noah — The Ark and the Covenant' } },
  { id: 'lp3', user_id: 'mock-student-id',  progress_pct: 0,   lessons: { title: 'Abraham — Father of Many Nations' } },
  { id: 'lp4', user_id: 'mock-student2-id', progress_pct: 100, lessons: { title: 'Genesis — The Creation Story' } },
  { id: 'lp5', user_id: 'mock-student2-id', progress_pct: 30,  lessons: { title: 'Noah — The Ark and the Covenant' } },
];

const MOCK_QUIZ_ATTEMPTS = [
  { id: 'q1', student_id: 'mock-student-id',  score: 90, total_possible: 100, percentage: 90.0, passed: true,  completed_at: '2026-06-25T10:00:00Z', quizzes: { title: 'Creation Review Quiz' } },
  { id: 'q2', student_id: 'mock-student-id',  score: 50, total_possible: 100, percentage: 50.0, passed: false, completed_at: '2026-06-20T10:00:00Z', quizzes: { title: 'Covenants Challenge' } },
  { id: 'q3', student_id: 'mock-student2-id', score: 75, total_possible: 100, percentage: 75.0, passed: true,  completed_at: '2026-06-24T10:00:00Z', quizzes: { title: 'Creation Review Quiz' } },
];

const MOCK_BRANCHES = [
  { id: 'branch-1', name: 'Main Cairo Cathedral' },
  { id: 'branch-2', name: 'Heliopolis Branch' },
];

const MOCK_CLASSES = [
  { id: 'class-1', name: 'St. George Class (Grade 5)' },
  { id: 'class-2', name: 'St. Mary Class (Grade 6)' },
];

export const MOCK_EVENTS = [
  {
    id: 'event-1',
    title: 'Summer Bible Camp 2026',
    description: 'A week-long summer camp filled with biblical stories, worship, crafts, and team-building activities for all Sunday School students.',
    type: 'camp',
    date: '2026-07-15',
    time: '08:00',
    end_time: '17:00',
    location: 'Main Cairo Cathedral Hall',
    branch_id: 'branch-1',
    max_capacity: 80,
    current_rsvp: 54,
    is_public: true,
    image_url: null,
    created_by: 'mock-admin-id',
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'event-2',
    title: "Father's Day Celebration Service",
    description: 'A special Sunday service honoring fathers in our community. Students will perform a choir piece and share crafted gifts.',
    type: 'service',
    date: '2026-07-06',
    time: '10:00',
    end_time: '12:30',
    location: 'Main Cathedral Sanctuary',
    branch_id: 'branch-1',
    max_capacity: 200,
    current_rsvp: 143,
    is_public: true,
    image_url: null,
    created_by: 'mock-admin-id',
    created_at: '2026-06-10T10:00:00Z',
  },
  {
    id: 'event-3',
    title: 'Servant Training Day',
    description: 'A focused day of spiritual and practical training for all Sunday School servants and instructors.',
    type: 'training',
    date: '2026-07-20',
    time: '09:00',
    end_time: '16:00',
    location: 'Heliopolis Branch Meeting Room',
    branch_id: 'branch-2',
    max_capacity: 40,
    current_rsvp: 27,
    is_public: false,
    image_url: null,
    created_by: 'mock-admin-id',
    created_at: '2026-06-12T10:00:00Z',
  },
  {
    id: 'event-4',
    title: 'End-of-Year Awards Ceremony',
    description: 'Celebrating the achievements of all students with certificates, medals, and special performances.',
    type: 'ceremony',
    date: '2026-08-30',
    time: '17:00',
    end_time: '20:00',
    location: 'Main Cairo Cathedral Hall',
    branch_id: 'branch-1',
    max_capacity: 300,
    current_rsvp: 12,
    is_public: true,
    image_url: null,
    created_by: 'mock-admin-id',
    created_at: '2026-06-15T10:00:00Z',
  },
];

// Student and parent RSVPs
export const MOCK_EVENT_REGISTRATIONS = [
  { id: 'reg-1', event_id: 'event-1', user_id: 'mock-student-id', registered_at: '2026-06-20T10:00:00Z' },
  { id: 'reg-2', event_id: 'event-2', user_id: 'mock-student-id', registered_at: '2026-06-21T10:00:00Z' },
  { id: 'reg-3', event_id: 'event-1', user_id: 'mock-parent-id',  registered_at: '2026-06-22T10:00:00Z' },
];

// ─── Chainable query builder ─────────────────────────────────────────────────

function buildQuery(initialData: any[]) {
  let data = [...initialData];

  const q: any = {
    eq(field: string, value: any) {
      data = data.filter((item) =>
        item[field] !== undefined ? item[field] === value : true
      );
      return q;
    },
    in(field: string, values: any[]) {
      data = data.filter((item) =>
        item[field] !== undefined ? values.includes(item[field]) : true
      );
      return q;
    },
    order(_col: string, _opt?: any) {
      // no-op — data already ordered in mock arrays
      return q;
    },
    single() {
      return Promise.resolve({ data: data[0] ?? null, error: null });
    },
    then(resolve: any) {
      return resolve({ data, error: null });
    },
  };

  return q;
}

export const MOCK_LESSONS = [
  {
    id: '1',
    title: 'The Story of Creation',
    title_ar: 'قصة الخلق',
    category: 'Genesis',
    category_ar: 'التكوين',
    verse: '"In the beginning, God created the heavens and the earth." — Genesis 1:1',
    verse_ar: '«فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.» — تكوين ١:١',
    level_required: 1,
    content: 'Creation lesson content',
  },
  {
    id: '2',
    title: "Noah's Ark & The Rainbow Promise",
    title_ar: 'فلك نوح وعهد قوس قزح',
    category: 'Genesis',
    category_ar: 'التكوين',
    verse: '"I have set my rainbow in the clouds..." — Genesis 9:13',
    verse_ar: '«وَضَعْتُ قَوْسِي فِي السَّحَابِ...» — تكوين ٩:١٣',
    level_required: 1,
    content: 'Noah lesson content',
  }
];

export const MOCK_LESSON_ATTACHMENTS = [
  { id: 'att-1', lesson_id: '1', file_name: 'Creation_Days_Worksheet.pdf', file_type: 'pdf', file_size: 1200000, file_url: 'mock-url' },
  { id: 'att-2', lesson_id: '1', file_name: 'Creation_Illustration.png', file_type: 'image', file_size: 820000, file_url: 'mock-url' },
  { id: 'att-3', lesson_id: '2', file_name: 'Noahs_Ark_Coloring.pdf', file_type: 'pdf', file_size: 950000, file_url: 'mock-url' }
];

export const createMockSupabase = (currentRole?: string) => {
  const getActiveRole = () => currentRole || getCookie('MOCK_USER_ROLE') || 'student';

  const getTableData = (table: string): any[] => {
    const role = getActiveRole();
    switch (table) {
      case 'user_profiles':
        return Object.values(MOCK_PROFILES);
      case 'parent_children':
        return MOCK_PARENT_CHILDREN;
      case 'attendance':
        return MOCK_ATTENDANCE;
      case 'lesson_progress':
        return MOCK_LESSON_PROGRESS;
      case 'lessons':
        return MOCK_LESSONS;
      case 'lesson_attachments':
        return MOCK_LESSON_ATTACHMENTS;
      case 'quiz_attempts':
        return MOCK_QUIZ_ATTEMPTS;
      case 'branches':
        return MOCK_BRANCHES;
      case 'classes':
        return MOCK_CLASSES;
      case 'events':
        return MOCK_EVENTS;
      case 'event_registrations':
        return MOCK_EVENT_REGISTRATIONS;
      default:
        return [];
    }
  };

  return {
    auth: {
      getSession: async () => {
        const role = getCookie('MOCK_USER_ROLE') || getActiveRole();
        if (!role) return { data: { session: null }, error: null };
        return { data: { session: { user: getMockUser(role), access_token: 'dummy' } }, error: null };
      },
      getUser: async () => {
        const role = getCookie('MOCK_USER_ROLE') || getActiveRole();
        if (!role) return { data: { user: null }, error: null };
        return { data: { user: getMockUser(role) }, error: null };
      },
      signInWithPassword: async ({ email }: any) => {
        const norm = email.toLowerCase();
        let role = 'student';
        if (norm.includes('admin'))                                        role = 'admin';
        else if (norm.includes('instructor') || norm.includes('servant')) role = 'instructor';
        else if (norm.includes('parent'))                                  role = 'parent';
        setCookie('MOCK_USER_ROLE', role);
        return { data: { user: getMockUser(role) }, error: null };
      },
      signInWithOAuth: async () => {
        setCookie('MOCK_USER_ROLE', 'student');
        return { data: {}, error: null };
      },
      signOut: async () => {
        deleteCookie('MOCK_USER_ROLE');
        return { error: null };
      },
      onAuthStateChange: (_cb: any) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },

    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: any) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `mock-url-for-${path}` } })
      })
    },

    from: (table: string) => ({
      select: (_fields?: string) => buildQuery(getTableData(table)),
      insert: (data: any) => ({
        select: () => buildQuery(Array.isArray(data) ? data : [data])
      })
    }),
  } as any;
};
