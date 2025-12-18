-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Users profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email citext unique,
  display_name text,
  role text default 'user' check (role in ('user', 'editor', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Axes (Ejes Lagrange)
create table if not exists public.axes (
  id text primary key,
  name text not null,
  description text,
  color text,
  order_num integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Episodes
create table if not exists public.episodes (
  id serial primary key,
  title text not null,
  slug text unique not null,
  description text,
  content text,
  duration text,
  audio_url text,
  published_at timestamp with time zone,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Chapters
create table if not exists public.chapters (
  id serial primary key,
  title text not null,
  slug text unique not null,
  summary text,
  theory text,
  axis_id text references public.axes(id),
  dialogue text,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Socratic Questions
create table if not exists public.questions (
  id text primary key,
  text text not null,
  eje text references public.axes(id),
  nivel text check (nivel in ('superficial', 'media', 'profunda')),
  tension text check (tension in ('baja', 'media', 'alta')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Lagrange Map Nodes (Questions in context)
create table if not exists public.map_nodes (
  id text primary key,
  question_id text references public.questions(id),
  eje text references public.axes(id),
  position_x numeric,
  position_y numeric,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Lagrange Map Connections (Relationships)
create table if not exists public.map_connections (
  id text primary key,
  source_id text references public.map_nodes(id),
  target_id text references public.map_nodes(id),
  type text check (type in ('refuerza', 'contradice', 'expande')),
  strength numeric default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Episode-Question relations
create table if not exists public.episode_questions (
  episode_id integer references public.episodes(id) on delete cascade,
  question_id text references public.questions(id) on delete cascade,
  primary key (episode_id, question_id)
);

-- Chapter-Episode relations
create table if not exists public.chapter_episodes (
  chapter_id integer references public.chapters(id) on delete cascade,
  episode_id integer references public.episodes(id) on delete cascade,
  primary key (chapter_id, episode_id)
);

-- Audio files storage metadata
create table if not exists public.audio_files (
  id uuid primary key default uuid_generate_v4(),
  episode_id integer references public.episodes(id) on delete cascade,
  file_path text not null,
  file_size integer,
  duration integer,
  format text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Search index table
create table if not exists public.search_index (
  id uuid primary key default uuid_generate_v4(),
  resource_type text check (resource_type in ('episode', 'chapter', 'question')),
  resource_id text,
  title text,
  content text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.episodes enable row level security;
alter table public.chapters enable row level security;
alter table public.questions enable row level security;
alter table public.audio_files enable row level security;

-- Public can read episodes
create policy "episodes_public_read" on public.episodes
  for select using (published_at is not null);

-- Public can read chapters
create policy "chapters_public_read" on public.chapters
  for select using (true);

-- Public can read questions
create policy "questions_public_read" on public.questions
  for select using (true);

-- Users can read own profile
create policy "profiles_user_read" on public.profiles
  for select using (auth.uid() = id or auth.jwt()->>'role' = 'admin');

-- Editors can create/update episodes
create policy "episodes_editor_create" on public.episodes
  for insert with check (auth.jwt()->>'role' in ('editor', 'admin'));

create policy "episodes_editor_update" on public.episodes
  for update using (created_by = auth.uid() or auth.jwt()->>'role' = 'admin');

-- Create indexes for performance
create index if not exists episodes_published_at on public.episodes(published_at);
create index if not exists episodes_slug on public.episodes(slug);
create index if not exists chapters_slug on public.chapters(slug);
create index if not exists chapters_axis on public.chapters(axis_id);
create index if not exists questions_eje on public.questions(eje);
create index if not exists map_nodes_question on public.map_nodes(question_id);
create index if not exists search_index_resource on public.search_index(resource_type, resource_id);
