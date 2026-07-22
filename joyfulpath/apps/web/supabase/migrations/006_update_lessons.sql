-- Update lessons schema to match UI

ALTER TABLE lessons
ADD COLUMN title_ar varchar(300),
ADD COLUMN category varchar(100),
ADD COLUMN category_ar varchar(100),
ADD COLUMN verse text,
ADD COLUMN verse_ar text,
ADD COLUMN level_required integer default 1;
