-- Run this in your Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- Symptom logs table
create table symptom_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  log_date date not null default current_date,
  symptoms jsonb not null default '{}',
  notes text,
  cycle_number integer,
  created_at timestamptz default now()
);

-- Index for fast lookups by user
create index idx_symptom_logs_user on symptom_logs(user_id, log_date desc);

-- Enable Row Level Security (so users can only see their own data)
alter table symptom_logs enable row level security;

-- Policy: users can read their own logs
create policy "Users can read own logs"
  on symptom_logs for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own logs
create policy "Users can insert own logs"
  on symptom_logs for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own logs
create policy "Users can update own logs"
  on symptom_logs for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own logs
create policy "Users can delete own logs"
  on symptom_logs for delete
  using (auth.uid() = user_id);
