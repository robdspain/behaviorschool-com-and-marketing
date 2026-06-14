-- Behavior Study Tools marketing attribution and daily operator logs.
-- The public collector and admin screens write through server-side Supabase
-- service-role clients, so RLS remains enabled without public write policies.

create table if not exists behavior_study_tools_marketing_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  source text not null default 'behaviorstudytools.com',
  page_path text,
  page_url text,
  page_title text,
  visitor_id text,
  session_id text,
  location text,
  intent text,
  destination text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_bst_marketing_events_received_at
  on behavior_study_tools_marketing_events (received_at desc);

create index if not exists idx_bst_marketing_events_event_name
  on behavior_study_tools_marketing_events (event_name);

create index if not exists idx_bst_marketing_events_page_path
  on behavior_study_tools_marketing_events (page_path);

create index if not exists idx_bst_marketing_events_session
  on behavior_study_tools_marketing_events (session_id);

alter table behavior_study_tools_marketing_events enable row level security;

create table if not exists behavior_study_tools_marketing_activity (
  id uuid primary key default gen_random_uuid(),
  activity_date date not null default current_date,
  channel text not null,
  primary_action text not null,
  published_url text,
  customer_signal text,
  competitor_signal text,
  seo_improvement text,
  next_step text,
  status text not null default 'logged',
  created_at timestamptz not null default now()
);

create index if not exists idx_bst_marketing_activity_date
  on behavior_study_tools_marketing_activity (activity_date desc, created_at desc);

create index if not exists idx_bst_marketing_activity_channel
  on behavior_study_tools_marketing_activity (channel);

alter table behavior_study_tools_marketing_activity enable row level security;
