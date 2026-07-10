-- LinkVault schema for Supabase Postgres
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).

create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists links (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  title text not null,
  destination_url text not null,
  slug text not null unique,
  campaign text not null default '',
  source text not null default '',
  medium text not null default '',
  status text not null default 'active',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clicks (
  id text primary key,
  link_id text not null references links(id) on delete cascade,
  user_agent text not null default '',
  referrer text not null default '',
  ip_hash text not null default '',
  country text not null default 'unknown',
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists links_user_id_idx on links(user_id);
create index if not exists clicks_link_id_idx on clicks(link_id);
create index if not exists sessions_user_id_idx on sessions(user_id);

-- Row Level Security stays on by default in Supabase. This app talks to
-- Postgres only from server-side code using the SERVICE ROLE key, which
-- bypasses RLS, so no policies are required for the app to function.
alter table users enable row level security;
alter table links enable row level security;
alter table clicks enable row level security;
alter table sessions enable row level security;
