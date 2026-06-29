-- Sunday School Platform Database Migration
-- 001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Enums
-- ============================================

create type user_role as enum ('admin', 'instructor', 'parent', 'student');
create type lesson_status as enum ('draft', 'published', 'archived');
create type lesson_progress_status as enum ('not_started', 'in_progress', 'completed');
create type attendance_status as enum ('present', 'absent', 'late', 'excused');
create type task_type as enum ('homework', 'memorization', 'activity', 'reading');
create type task_status as enum ('draft', 'active', 'closed');
create type submission_status as enum ('pending', 'approved', 'rejected', 'revision_requested');
create type quiz_type as enum ('lesson_review', 'weekly', 'challenge', 'practice');
create type question_type as enum ('multiple_choice', 'true_false', 'verse_completion', 'short_answer');
create type points_type as enum ('xp', 'points');
create type points_source as enum ('lesson', 'quiz', 'task', 'attendance', 'badge', 'manual', 'redemption', 'streak_bonus');
create type badge_category as enum ('attendance', 'lesson', 'quiz', 'social', 'special', 'streak');
create type badge_criteria_type as enum ('count', 'streak', 'score', 'manual');
create type badge_rarity as enum ('common', 'uncommon', 'rare', 'epic', 'legendary');
create type leaderboard_period as enum ('weekly', 'monthly', 'all_time');
create type announcement_priority as enum ('low', 'normal', 'high', 'urgent');
create type prayer_request_type as enum ('prayer', 'thanksgiving');
create type reward_item_type as enum ('digital', 'physical');
create type digital_reward_type as enum ('title', 'avatar_frame', 'profile_theme');
create type physical_reward_type as enum ('book', 'gift', 'stationery');
create type redemption_status as enum ('pending', 'approved', 'rejected');
create type challenge_type as enum ('daily', 'weekly', 'seasonal');
create type notification_type as enum ('lesson', 'challenge', 'badge', 'reward', 'announcement', 'prayer', 'event');

-- ============================================
-- Core Tables
-- ============================================

-- 1. Branches
create table branches (
  id uuid primary key default gen_random_uuid(),
  name varchar(250) not null,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Levels
create table levels (
  id uuid primary key default gen_random_uuid(),
  level_number integer unique not null,
  title varchar(100) not null,
  title_ar varchar(100),
  min_xp integer not null,
  max_xp integer not null,
  icon_url text,
  color varchar(7)
);

-- 3. Users Profiles (Extends Supabase auth.users)
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(50) unique,
  email varchar(255) unique,
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  display_name varchar(100) not null,
  avatar_url text,
  role user_role default 'student'::user_role not null,
  locale varchar(5) default 'en' not null,
  phone_number varchar(20),
  birth_date date,
  gender varchar(10),
  branch_id uuid references branches(id) on delete set null,
  total_xp integer default 0 not null,
  total_points integer default 0 not null,
  current_level_id uuid references levels(id) on delete set null,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  last_active_at timestamp with time zone,
  is_active boolean default true not null,
  digital_rewards jsonb default '{"titles":[],"frames":[],"themes":[]}'::jsonb not null,
  active_title varchar(100),
  active_avatar_frame text,
  active_profile_theme varchar(50),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Parent-Children Link Table
create table parent_children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references user_profiles(id) on delete cascade,
  student_id uuid not null references user_profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (parent_id, student_id)
);

-- 5. Classes
create table classes (
  id uuid primary key default gen_random_uuid(),
  name varchar(200) not null,
  description text,
  grade_level varchar(50),
  academic_year varchar(20) not null,
  is_active boolean default true not null,
  max_students integer default 30 not null,
  branch_id uuid references branches(id) on delete cascade,
  created_by uuid references user_profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Class Members
create table class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  role user_role not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true not null,
  unique (class_id, user_id)
);

-- Indexing for lookup speed
create index idx_class_members_class on class_members(class_id);
create index idx_class_members_user on class_members(user_id);
