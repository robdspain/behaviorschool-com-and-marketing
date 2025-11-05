-- Add optional columns used by Admin → Sitemap controls
-- Safe to run multiple times

-- Create table if missing
create table if not exists page_index_settings (
  path text primary key,
  index boolean not null default true,
  in_sitemap boolean not null default false,
  deleted boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Ensure columns exist with defaults
alter table page_index_settings
  add column if not exists index boolean not null default true,
  add column if not exists in_sitemap boolean not null default false,
  add column if not exists deleted boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();
