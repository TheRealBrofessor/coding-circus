-- Coding Circus Supabase schema
-- Apply this in the Supabase SQL editor or through the Supabase CLI.
-- This schema is designed for a static Vite/GitHub Pages frontend using Supabase Auth + Row Level Security.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_length check (username is null or char_length(username) between 3 and 32),
  constraint username_format check (username is null or username ~ '^[a-zA-Z0-9_]+$')
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  workspace_json jsonb not null,
  generated_python text not null default '',
  thumbnail_url text,
  visibility text not null default 'private',
  python_version_target text,
  block_schema_version text not null default '1',
  forked_from_project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint project_title_length check (char_length(title) between 1 and 120),
  constraint project_visibility_check check (visibility in ('private', 'unlisted', 'public'))
);

create table if not exists public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  version_number integer not null,
  workspace_json jsonb not null,
  generated_python text not null default '',
  created_at timestamptz not null default now(),
  unique(project_id, version_number)
);

create table if not exists public.project_likes (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.project_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  constraint report_reason_length check (char_length(reason) between 3 and 80),
  constraint report_status_check check (status in ('open', 'reviewing', 'resolved', 'dismissed'))
);

create index if not exists projects_owner_id_idx on public.projects(owner_id);
create index if not exists projects_visibility_published_idx on public.projects(visibility, published_at desc);
create index if not exists project_versions_project_id_idx on public.project_versions(project_id);
create index if not exists project_likes_user_id_idx on public.project_likes(user_id);
create index if not exists project_reports_project_id_idx on public.project_reports(project_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_versions enable row level security;
alter table public.project_likes enable row level security;
alter table public.project_reports enable row level security;

-- Profiles
create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Projects
create policy "public and unlisted projects are readable"
  on public.projects for select
  using (visibility in ('public', 'unlisted') or auth.uid() = owner_id);

create policy "users can create their own projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "users can update their own projects"
  on public.projects for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = owner_id);

-- Project versions
create policy "read versions for readable projects"
  on public.project_versions for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_versions.project_id
        and (p.visibility in ('public', 'unlisted') or p.owner_id = auth.uid())
    )
  );

create policy "users can create versions for their own projects"
  on public.project_versions for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.projects p
      where p.id = project_versions.project_id
        and p.owner_id = auth.uid()
    )
  );

-- Likes
create policy "likes are publicly readable"
  on public.project_likes for select
  using (true);

create policy "users can like projects as themselves"
  on public.project_likes for insert
  with check (auth.uid() = user_id);

create policy "users can remove their own likes"
  on public.project_likes for delete
  using (auth.uid() = user_id);

-- Reports
create policy "users can report projects"
  on public.project_reports for insert
  with check (auth.uid() = reporter_id);

create policy "users can read their own reports"
  on public.project_reports for select
  using (auth.uid() = reporter_id);

-- Updated timestamp helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- Optional helper: automatically create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
