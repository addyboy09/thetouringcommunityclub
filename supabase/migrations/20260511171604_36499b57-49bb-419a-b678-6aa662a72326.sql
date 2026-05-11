
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- First signup becomes admin, rest become user
create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  user_count int;
begin
  select count(*) into user_count from public.user_roles;
  if user_count = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_assign_role
  after insert on auth.users
  for each row execute function public.handle_new_user_role();

-- Meetups
create table public.meetups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_text text not null,
  location text not null,
  spaces text not null default '',
  description text not null default '',
  tag text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.meetups enable row level security;

create policy "Anyone can view meetups" on public.meetups
  for select using (true);
create policy "Admins can insert meetups" on public.meetups
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update meetups" on public.meetups
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete meetups" on public.meetups
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger meetups_set_updated_at before update on public.meetups
  for each row execute function public.set_updated_at();
