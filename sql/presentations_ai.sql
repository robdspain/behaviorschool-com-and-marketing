-- Presenton AI: SQL schema for presentations and images
-- Apply in Supabase SQL editor or via migrate script

-- Ensure UUID generator is available
create extension if not exists pgcrypto;

-- Presentations table
create table if not exists public.presentations_ai (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  slide_count integer not null default 10,
  template text not null default 'modern',
  tone text null,
  language text null,
  provider text not null,
  model text null,
  export_format text not null default 'pptx',
  storage_path text not null,
  created_by uuid null,
  created_at timestamptz not null default now()
);

alter table public.presentations_ai enable row level security;
drop policy if exists "admin read" on public.presentations_ai;
create policy "admin read" on public.presentations_ai for select using (true);
drop policy if exists "admin write" on public.presentations_ai;
create policy "admin write" on public.presentations_ai for insert with check (true);
drop policy if exists "admin delete" on public.presentations_ai;
create policy "admin delete" on public.presentations_ai for delete using (true);

-- Images table for generated assets
create table if not exists public.presentations_ai_images (
  id uuid primary key default gen_random_uuid(),
  prompt text not null,
  provider text not null,
  model text null,
  url text not null,
  storage_path text not null,
  created_at timestamptz not null default now()


alter table public.presentations_ai_images enable row level security;
drop policy if exists "images admin read" on public.presentations_ai_images;
create policy "images admin read" on public.presentations_ai_images for select using (true);
drop policy if exists "images admin write" on public.presentations_ai_images;
create policy "images admin write" on public.presentations_ai_images for insert with check (true);
drop policy if exists "images admin delete" on public.presentations_ai_images;
create policy "images admin delete" on public.presentations_ai_images for delete using (true);

