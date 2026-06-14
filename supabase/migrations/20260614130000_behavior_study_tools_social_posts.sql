-- Behavior Study Tools social publishing queue.
-- Rows are generated from the marketing plan/daily growth report and published
-- through a configured server-side webhook such as Buffer, Zapier, Make, or a
-- custom social scheduler.

create table if not exists behavior_study_tools_social_posts (
  id uuid primary key default gen_random_uuid(),
  post_date date not null default current_date,
  scheduled_at timestamptz not null default now(),
  platform text not null,
  status text not null default 'queued',
  hook text not null,
  body text not null,
  cta_label text,
  cta_url text,
  asset text,
  source text not null default 'daily_generator',
  source_signal_id uuid,
  external_url text,
  publish_result jsonb not null default '{}'::jsonb,
  feedback_metrics jsonb not null default '{}'::jsonb,
  error_message text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bst_social_posts_date
  on behavior_study_tools_social_posts (post_date desc, scheduled_at desc);

create index if not exists idx_bst_social_posts_status
  on behavior_study_tools_social_posts (status, scheduled_at);

create index if not exists idx_bst_social_posts_platform
  on behavior_study_tools_social_posts (platform);

alter table behavior_study_tools_social_posts enable row level security;
