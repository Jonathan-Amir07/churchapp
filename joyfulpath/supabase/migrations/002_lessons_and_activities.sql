-- Sunday School Platform Database Migration
-- 002_lessons_and_activities.sql

-- 7. Lessons
create table lessons (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  title varchar(300) not null,
  description text,
  content text not null,
  bible_references jsonb default '[]'::jsonb not null,
  thumbnail_url text,
  xp_reward integer default 50 not null,
  points_reward integer default 10 not null,
  order_index integer default 0 not null,
  status lesson_status default 'draft'::lesson_status not null,
  published_at timestamp with time zone,
  created_by uuid references user_profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_lessons_class on lessons(class_id);
create index idx_lessons_status on lessons(status);

-- 8. Lesson Attachments
create table lesson_attachments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  file_name varchar(255) not null,
  file_url text not null,
  file_type varchar(50) not null,
  file_size integer not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Lesson Progress
create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  status lesson_progress_status default 'not_started'::lesson_progress_status not null,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  progress_pct integer default 0 not null,
  unique (lesson_id, user_id)
);

-- 10. Attendance
create table attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  date date not null,
  status attendance_status not null,
  recorded_by uuid not null references user_profiles(id) on delete set null,
  notes text,
  xp_awarded integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (class_id, user_id, date)
);

create index idx_attendance_lookup on attendance(class_id, date);

-- 11. Tasks (Homework)
create table tasks (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  title varchar(300) not null,
  description text not null,
  task_type task_type not null,
  xp_reward integer default 30 not null,
  points_reward integer default 5 not null,
  due_date timestamp with time zone,
  max_submissions integer default 1 not null,
  allow_late boolean default false not null,
  status task_status default 'draft'::task_status not null,
  created_by uuid references user_profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Task Submissions
create table task_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  student_id uuid not null references user_profiles(id) on delete cascade,
  content text,
  attachment_url text,
  status submission_status default 'pending'::submission_status not null,
  feedback text,
  reviewed_by uuid references user_profiles(id) on delete set null,
  reviewed_at timestamp with time zone,
  xp_awarded integer default 0 not null,
  points_awarded integer default 0 not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  attempt_number integer default 1 not null
);

create index idx_submissions_lookup on task_submissions(task_id, student_id);

-- 13. Quizzes
create table quizzes (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  title varchar(300) not null,
  description text,
  quiz_type quiz_type not null,
  time_limit_seconds integer,
  max_attempts integer default 3 not null,
  passing_score integer default 70 not null,
  xp_reward integer default 50 not null,
  points_reward integer default 10 not null,
  shuffle_questions boolean default true not null,
  show_answers_after boolean default true not null,
  status task_status default 'draft'::task_status not null,
  available_from timestamp with time zone,
  available_until timestamp with time zone,
  created_by uuid references user_profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Questions
create table questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question_type question_type not null,
  question_text text not null,
  question_image_url text,
  bible_reference varchar(100),
  points_value integer default 10 not null,
  order_index integer default 0 not null,
  explanation text
);

-- 15. Answers
create table answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  answer_text text not null,
  is_correct boolean default false not null,
  order_index integer default 0 not null
);

-- 16. Quiz Attempts
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  student_id uuid not null references user_profiles(id) on delete cascade,
  score integer not null,
  total_possible integer not null,
  percentage decimal(5, 2) not null,
  passed boolean not null,
  time_taken_seconds integer,
  answers_snapshot jsonb not null,
  xp_awarded integer default 0 not null,
  points_awarded integer default 0 not null,
  attempt_number integer not null,
  started_at timestamp with time zone not null,
  completed_at timestamp with time zone not null
);

-- 17. Points Transactions
create table points_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  amount integer not null,
  type points_type not null,
  source points_source not null,
  source_id uuid,
  description varchar(500) not null,
  awarded_by uuid references user_profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 18. Badges
create table badges (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  name_ar varchar(100),
  description text not null,
  description_ar text,
  icon_url text not null,
  category badge_category not null,
  criteria_type badge_criteria_type not null,
  criteria_value integer,
  criteria_config jsonb default '{}'::jsonb not null,
  xp_bonus integer default 0 not null,
  points_bonus integer default 0 not null,
  rarity badge_rarity default 'common'::badge_rarity not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 19. Student Badges
create table student_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  displayed boolean default false not null,
  unique (user_id, badge_id)
);

-- 20. Leaderboard Entries
create table leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  class_id uuid references classes(id) on delete cascade,
  period leaderboard_period not null,
  period_start date not null,
  total_xp integer default 0 not null,
  rank integer,
  rank_change integer default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, class_id, period, period_start)
);

-- 21. Announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  author_id uuid not null references user_profiles(id) on delete cascade,
  title varchar(300) not null,
  content text not null,
  priority announcement_priority default 'normal'::announcement_priority not null,
  is_pinned boolean default false not null,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 22. Prayer Requests
create table prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  class_id uuid references classes(id) on delete cascade,
  type prayer_request_type default 'prayer'::prayer_request_type not null,
  content text not null,
  is_private boolean default false not null,
  is_prayed_for boolean default false not null,
  prayed_count integer default 0 not null,
  response text,
  responder_id uuid references user_profiles(id) on delete set null,
  responded_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 23. Reward Items
create table reward_items (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  title_ar varchar(200),
  description text not null,
  description_ar text,
  type reward_item_type not null,
  digital_type digital_reward_type,
  physical_type physical_reward_type,
  points_cost integer not null,
  image_url text,
  stock integer default 0 not null,
  is_active boolean default true not null,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 24. Reward Redemptions
create table reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  item_id uuid not null references reward_items(id) on delete cascade,
  status redemption_status default 'pending'::redemption_status not null,
  notes text,
  feedback text,
  approved_by uuid references user_profiles(id) on delete set null,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 25. Challenges
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  title_ar varchar(200),
  description text not null,
  description_ar text,
  type challenge_type default 'daily'::challenge_type not null,
  criteria_config jsonb not null,
  xp_reward integer default 50 not null,
  points_reward integer default 10 not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 26. Challenge Progress
create table challenge_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  current_val integer default 0 not null,
  is_completed boolean default false not null,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, challenge_id)
);

-- 27. Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  type notification_type not null,
  title_en varchar(200) not null,
  title_ar varchar(200) not null,
  message_en text not null,
  message_ar text not null,
  is_read boolean default false not null,
  read_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 28. Events
create table events (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  title_ar varchar(200),
  description text,
  description_ar text,
  event_type varchar(50) not null,
  image_url text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  location text,
  max_participants integer,
  xp_reward integer default 100 not null,
  points_reward integer default 20 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 29. Event Registrations
create table event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  status varchar(50) default 'registered' not null,
  checked_in boolean default false not null,
  checked_in_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, user_id)
);

-- 30. Activity Log
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  action varchar(100) not null,
  entity_type varchar(50) not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb not null,
  xp_change integer default 0 not null,
  points_change integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
