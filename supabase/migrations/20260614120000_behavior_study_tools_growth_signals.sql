-- Daily growth inputs for Behavior Study Tools.
-- Use this table for Google Search Console, Ahrefs, social feedback,
-- trend research, customer objections, competitor changes, and daily monitor
-- snapshots. Writes should go through authenticated admin/server endpoints.

create table if not exists behavior_study_tools_growth_signals (
  id uuid primary key default gen_random_uuid(),
  signal_date date not null default current_date,
  source text not null,
  signal_type text not null,
  channel text,
  url text,
  keyword text,
  topic text,
  metric_name text,
  metric_value numeric,
  previous_value numeric,
  change_value numeric,
  change_percent numeric,
  metadata jsonb not null default '{}'::jsonb,
  recommendation text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_bst_growth_signals_date
  on behavior_study_tools_growth_signals (signal_date desc, created_at desc);

create index if not exists idx_bst_growth_signals_source
  on behavior_study_tools_growth_signals (source);

create index if not exists idx_bst_growth_signals_type
  on behavior_study_tools_growth_signals (signal_type);

create index if not exists idx_bst_growth_signals_keyword
  on behavior_study_tools_growth_signals (keyword);

alter table behavior_study_tools_growth_signals enable row level security;
