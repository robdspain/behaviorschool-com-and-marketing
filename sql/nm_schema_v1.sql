-- Newsletter Manager (nm_) core schema (Phase 1)

create table if not exists nm_lists (
  id bigserial primary key,
  name text not null unique,
  visibility text not null default 'public', -- public | private
  optin text not null default 'single', -- single | double
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nm_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  status text not null default 'enabled', -- enabled | disabled | unsubscribed | blacklisted | bounced
  attributes jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nm_subscriber_lists (
  subscriber_id uuid not null references nm_subscribers(id) on delete cascade,
  list_id bigint not null references nm_lists(id) on delete cascade,
  status text not null default 'subscribed', -- pending | subscribed | unsubscribed
  token text, -- for double opt-in
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (subscriber_id, list_id)
);

create table if not exists nm_templates (
  id bigserial primary key,
  name text not null unique,
  body_html text not null,
  body_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nm_campaigns (
  id bigserial primary key,
  name text not null,
  subject text not null,
  body_html text,
  body_text text,
  template_id bigint references nm_templates(id) on delete set null,
  status text not null default 'draft', -- draft | scheduled | running | paused | sent | failed
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nm_campaign_lists (
  campaign_id bigint not null references nm_campaigns(id) on delete cascade,
  list_id bigint not null references nm_lists(id) on delete cascade,
  primary key (campaign_id, list_id)
);

create table if not exists nm_queue (
  id bigserial primary key,
  campaign_id bigint not null references nm_campaigns(id) on delete cascade,
  subscriber_id uuid not null references nm_subscribers(id) on delete cascade,
  status text not null default 'queued', -- queued | sent | failed | bounced | deferred
  last_error text,
  attempts int not null default 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists nm_events (
  id bigserial primary key,
  campaign_id bigint references nm_campaigns(id) on delete set null,
  subscriber_id uuid references nm_subscribers(id) on delete set null,
  type text not null, -- open | click | bounce | unsub | complaint
  url text,
  ua text,
  ip inet,
  created_at timestamptz not null default now()
);

create table if not exists nm_links (
  id bigserial primary key,
  campaign_id bigint not null references nm_campaigns(id) on delete cascade,
  url text not null,
  click_count int not null default 0
);

create table if not exists nm_settings (
  key text primary key,
  value jsonb not null
);

-- Helpful indexes
create index if not exists idx_nm_subscribers_status on nm_subscribers(status);
create index if not exists idx_nm_subscriber_lists_status on nm_subscriber_lists(status);
create index if not exists idx_nm_queue_status on nm_queue(status);

