-- Sunday School Platform Database Migration
-- 005_storage_setup.sql

-- Create Buckets
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('lesson-attachments', 'lesson-attachments', true),
  ('task-submissions', 'task-submissions', false)
on conflict (id) do nothing;

-- Set up Storage Policies on avatars bucket
create policy "Allow public read access on avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Allow authenticated users to upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Allow users to update/delete own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Set up Storage Policies on lesson-attachments
create policy "Allow public read access on lesson-attachments"
  on storage.objects for select
  using (bucket_id = 'lesson-attachments');

create policy "Allow instructors/admins to upload lesson-attachments"
  on storage.objects for insert
  with check (
    bucket_id = 'lesson-attachments' and 
    (
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' or 
      auth.jwt() -> 'app_metadata' ->> 'role' = 'instructor'
    )
  );

-- Set up Storage Policies on task-submissions
create policy "Allow instructors/admins/owners to read task-submissions"
  on storage.objects for select
  using (
    bucket_id = 'task-submissions' and 
    (
      auth.uid()::text = (storage.foldername(name))[1] or
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' or 
      auth.jwt() -> 'app_metadata' ->> 'role' = 'instructor'
    )
  );

create policy "Allow students to upload task-submissions"
  on storage.objects for insert
  with check (bucket_id = 'task-submissions' and auth.role() = 'authenticated');
