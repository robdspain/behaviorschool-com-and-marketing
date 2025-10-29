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

-- JSON-based presentations (full slides, charts, etc.)
create table if not exists public.presentations_ai_docs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  template text not null default 'modern',
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.presentations_ai_docs enable row level security;
drop policy if exists "docs admin read" on public.presentations_ai_docs;
create policy "docs admin read" on public.presentations_ai_docs for select using (true);
drop policy if exists "docs admin write" on public.presentations_ai_docs;
create policy "docs admin write" on public.presentations_ai_docs for insert with check (true);
drop policy if exists "docs admin update" on public.presentations_ai_docs;
create policy "docs admin update" on public.presentations_ai_docs for update using (true) with check (true);
drop policy if exists "docs admin delete" on public.presentations_ai_docs;
create policy "docs admin delete" on public.presentations_ai_docs for delete using (true);

-- Async jobs for generation
create table if not exists public.presentations_ai_jobs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'queued',
  progress integer not null default 0,
  format text not null default 'pptx',
  topic text,
  result_path text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.presentations_ai_jobs enable row level security;
drop policy if exists "jobs admin read" on public.presentations_ai_jobs;
create policy "jobs admin read" on public.presentations_ai_jobs for select using (true);
drop policy if exists "jobs admin write" on public.presentations_ai_jobs;
create policy "jobs admin write" on public.presentations_ai_jobs for insert with check (true);
drop policy if exists "jobs admin update" on public.presentations_ai_jobs;
create policy "jobs admin update" on public.presentations_ai_jobs for update using (true) with check (true);
