-- Sunday School Platform Database Migration
-- 003_auth_trigger_and_rls.sql

-- ============================================
-- Sync auth.users to public.user_profiles
-- ============================================

create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
declare
  default_display_name varchar(100);
begin
  default_display_name := coalesce(
    new.raw_user_meta_data->>'display_name',
    concat(coalesce(new.raw_user_meta_data->>'first_name', ''), ' ', coalesce(new.raw_user_meta_data->>'last_name', '')),
    new.email
  );

  insert into public.user_profiles (
    id,
    email,
    username,
    first_name,
    last_name,
    display_name,
    role,
    locale,
    phone_number,
    avatar_url
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'first_name', 'User'),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    default_display_name,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    coalesce(new.raw_user_meta_data->>'locale', 'en'),
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Insert default app metadata for role-based auth inside supabase JWT
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || 
    jsonb_build_object('role', coalesce(new.raw_user_meta_data->>'role', 'student'))
  where id = new.id;

  return new;
end;
$$;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
alter table user_profiles enable row level security;
alter table parent_children enable row level security;
alter table branches enable row level security;
alter table classes enable row level security;
alter table class_members enable row level security;
alter table lessons enable row level security;
alter table lesson_attachments enable row level security;
alter table lesson_progress enable row level security;
alter table attendance enable row level security;
alter table tasks enable row level security;
alter table task_submissions enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;
alter table quiz_attempts enable row level security;
alter table points_transactions enable row level security;
alter table levels enable row level security;
alter table badges enable row level security;
alter table student_badges enable row level security;
alter table leaderboard_entries enable row level security;
alter table announcements enable row level security;
alter table prayer_requests enable row level security;
alter table reward_items enable row level security;
alter table reward_redemptions enable row level security;
alter table challenges enable row level security;
alter table challenge_progress enable row level security;
alter table notifications enable row level security;
alter table events enable row level security;
alter table event_registrations enable row level security;
alter table activity_log enable row level security;


-- Define RLS Policies for user_profiles
create policy "Allow public read-only of profiles"
  on user_profiles for select
  using (true);

create policy "Allow users to update own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- Define basic RLS Policies for general reading
create policy "Allow select branches for authenticated users"
  on branches for select
  using (auth.role() = 'authenticated');

create policy "Allow select levels for everyone"
  on levels for select
  using (true);

create policy "Allow select classes for authenticated users"
  on classes for select
  using (auth.role() = 'authenticated');

create policy "Allow select class members for authenticated users"
  on class_members for select
  using (auth.role() = 'authenticated');
